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
 * @param {Object} files - Object where keys are filenames and values have 'content'
 * @param {string} entryPoint - The main file to execute (e.g., 'main.js')
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number, timedOut: boolean}>}
 */
async function executeCode(files, entryPoint = 'index.js') {
    // 1. Create a unique temp directory for this execution run
    const baseTmpDir = os.tmpdir();
    const runDir = fs.mkdtempSync(path.join(baseTmpDir, 'sandbox-run-'));

    // 2. Write all provided files to the runDir
    try {
        for (const [filename, fileObj] of Object.entries(files)) {
            const filePath = path.join(runDir, filename);
            // Ensure subdirectories exist if needed (though scenarios are flat for now)
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, fileObj.content || '', 'utf-8');
        }
    } catch (err) {
        return {
            stdout: '',
            stderr: `System error preparing sandbox files: ${err.message}`,
            exitCode: 1,
            timedOut: false
        };
    }

    return new Promise((resolve) => {
        let stdout = '';
        let stderr = '';
        let timedOut = false;

        // 3. Build docker run args
        // We mount the entire runDir to /sandbox in the container
        const dockerArgs = [
            'run',
            '--rm',
            '--network', 'none',
            '--memory', '64m',
            '--memory-swap', '64m',
            '--cpus', '0.5',
            '--read-only',
            '--tmpfs', '/tmp:size=8m',
            '-v', `${runDir}:/sandbox:ro`, // mount the whole directory read-only
            RUNNER_IMAGE,
            'node', `/sandbox/${entryPoint}`
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
            // 4. Cleanup the entire temp directory
            try {
                fs.rmSync(runDir, { recursive: true, force: true });
            } catch (_) { }

            resolve({
                stdout: stdout.slice(0, 8192),
                stderr: stderr.slice(0, 4096),
                exitCode: code ?? 1,
                timedOut,
            });
        });

        proc.on('error', (err) => {
            clearTimeout(timer);
            try { fs.rmSync(runDir, { recursive: true, force: true }); } catch (_) { }
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
