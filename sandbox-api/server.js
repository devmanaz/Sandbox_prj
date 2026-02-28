/**
 * server.js — Sandbox Execution API
 * Receives JavaScript code from the React frontend and executes it
 * safely inside an isolated Docker container.
 *
 * POST /execute   { code: string }  → { stdout, stderr, exitCode, timedOut, passed }
 * GET  /health                      → { status: "ok" }
 */

const express = require('express');
const cors = require('cors');
const { executeCode } = require('./executor');

const app = express();
const PORT = 3001;

// Allow requests from the Vite dev server and any localhost origin
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST'],
}));
app.use(express.json({ limit: '256kb' }));  // cap payload to prevent abuse

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'sandbox-api', timestamp: new Date().toISOString() });
});

// ── Execute endpoint ────────────────────────────────────────────────────────
/**
 * Body:
 *   code        {string}  - JavaScript source to execute
 *   testCheck   {string}  - optional: serialized test-check function body,
 *                           e.g. "return code.includes('taxRate') && code.includes('*')"
 *                           Evaluated server-side against the submitted code string.
 */
app.post('/execute', async (req, res) => {
    const { code, testCheck } = req.body;

    if (typeof code !== 'string' || code.trim().length === 0) {
        return res.status(400).json({ error: 'No code provided.' });
    }

    // Hard cap on code size (32 KB)
    if (code.length > 32_768) {
        return res.status(400).json({ error: 'Code exceeds maximum allowed size (32 KB).' });
    }

    try {
        const result = await executeCode(code);

        // Determine if the scenario's testCheck passes
        let passed = false;
        if (typeof testCheck === 'string' && testCheck.trim()) {
            try {
                // eslint-disable-next-line no-new-func
                const checkFn = new Function('code', testCheck);
                passed = !!checkFn(code);
            } catch (e) {
                console.warn('testCheck evaluation error:', e.message);
            }
        }

        return res.json({
            stdout: result.stdout,
            stderr: result.stderr,
            exitCode: result.exitCode,
            timedOut: result.timedOut,
            passed,
        });

    } catch (err) {
        console.error('/execute error:', err);
        return res.status(500).json({
            error: 'Internal server error during execution.',
            details: err.message,
        });
    }
});

// ── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n✅ Sandbox API running at http://localhost:${PORT}`);
    console.log('   POST /execute  — run user code in Docker');
    console.log('   GET  /health   — readiness check\n');
});
