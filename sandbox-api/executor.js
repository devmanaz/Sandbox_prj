/**
 * executor.js
 * Runs user-supplied JavaScript code inside an isolated Docker container.
 * Security properties:
 *  - --network none       : no outbound internet access
 *  - --memory 64m         : hard memory cap
 *  - --cpus 0.5           : half a CPU core at most
 *  - --read-only          : container filesystem is read-only
 *  - --rm                 : container auto-deleted after run
 *  - runs as non-root (runner user defined in runner.Dockerfile)
 *  - 10-second wall-clock timeout enforced by Node
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const crypto = require('crypto');

const RUNNER_IMAGE = 'sandbox-runner';
const TIMEOUT_MS = 10_000; // 10 seconds

/**
 * executeCode
 * @param {string} code - JavaScript source code to run
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, timedOut: boolean}>}
 */
async function executeCode(code) {
    // Write code to a unique temp file so we can bind-mount it read-only
    const tmpDir = os.tmpdir();
    const fileName = `sandbox_${crypto.randomBytes(8).toString('hex')}.js`;
    const filePath = path.join(tmpDir, fileName);

    fs.writeFileSync(filePath, code, 'utf-8');

    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;

        // Build docker run args
        const dockerArgs = [
            'run',
            '--rm',                           // auto-remove container
            '--network', 'none',              // no internet
            '--memory', '64m',               // RAM cap
            '--memory-swap', '64m',          // disable swap
            '--cpus', '0.5',                 // CPU cap
            '--read-only',                   // read-only FS
            '--tmpfs', '/tmp:size=8m',       // allow small /tmp writes
            '-v', `${filePath}:/sandbox/code.js:ro`, // mount code
            RUNNER_IMAGE,
            'node', '/sandbox/code.js'
        ];

        const proc = spawn('docker', dockerArgs);

        proc.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        // Kill after timeout
        const timer = setTimeout(() => {
            timedOut = true;
            proc.kill('SIGKILL');
        }, TIMEOUT_MS);

        proc.on('close', (code) => {
            clearTimeout(timer);
            // Cleanup temp file
            try { fs.unlinkSync(filePath); } catch (_) { }

            resolve({
                stdout: stdout.slice(0, 8192),   // cap output at 8KB
                stderr: stderr.slice(0, 4096),
                exitCode: code ?? 1,
                timedOut,
            });
        });

        proc.on('error', (err) => {
            clearTimeout(timer);
            try { fs.unlinkSync(filePath); } catch (_) { }
            resolve({
                stdout: '',
                stderr: `Failed to spawn Docker: ${err.message}\nMake sure Docker is running and the "sandbox-runner" image is built.`,
                exitCode: 1,
                timedOut: false,
            });
        });
    });
}

module.exports = { executeCode };
