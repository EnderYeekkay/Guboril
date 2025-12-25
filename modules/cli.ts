import { app } from 'electron';
import path from 'path';
import { execSync } from 'child_process';

const exeDir = path.dirname(app.getPath('exe'));

export function init_cli() {
    if (process.platform !== 'win32') return;

    console.log('[CLI-INIT] Target Directory:', exeDir);

    try {
        const currentPath = execSync(
            `powershell -command "[Environment]::GetEnvironmentVariable('Path', 'User')"`
        ).toString().trim();

        console.log('[CLI-INIT] Current User PATH length:', currentPath.length);

        const parts = currentPath.split(';').map(p => p.trim()).filter(Boolean);
        const normalizedTarget = path.normalize(exeDir).toLowerCase();

        if (parts.some(p => path.normalize(p).toLowerCase() === normalizedTarget)) {
            console.log('[CLI-INIT] Directory already in PATH.');
            return;
        }

        const newPath = [...parts, exeDir].join(';');

        execSync(
            `powershell -command "[Environment]::SetEnvironmentVariable('Path', '${newPath}', 'User')"`
        );
        console.log('[CLI-INIT] SUCCESS: PATH updated.');

    } catch (err) {
        console.error('[CLI-INIT] Error during PATH update:', err.stack);
    }
}

export function remove_cli() {
    if (process.platform !== 'win32') return;

    console.log('[CLI-REMOVE] Target Directory to remove:', exeDir);

    try {
        const currentPath = execSync(
            `powershell -command "[Environment]::GetEnvironmentVariable('Path', 'User')"`
        ).toString().trim();

        const parts = currentPath.split(';').map(p => p.trim()).filter(Boolean);
        const normalizedTarget = path.normalize(exeDir).toLowerCase();

        const filteredParts = parts.filter(p => path.normalize(p).toLowerCase() !== normalizedTarget);

        if (parts.length === filteredParts.length) {
            console.log('[CLI-REMOVE] Directory was not in PATH. Nothing to do.');
            return;
        }

        const newPath = filteredParts.join(';');

        execSync(
            `powershell -command "[Environment]::SetEnvironmentVariable('Path', '${newPath}', 'User')"`
        );
        console.log('[CLI-REMOVE] SUCCESS: PATH updated (entry removed).');
    } catch (err) {
        console.error('[CLI-REMOVE] Error during PATH removal:', err.stack);
    }
}
