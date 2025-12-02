import { execSync } from 'child_process';
import { app } from 'electron/main';

const taskName = 'Guboril';
const exePath = app.getPath('exe'); // Path to current executable
const launchArgs = '--tray'; // Flag for autostart

export function createTask(): boolean {
  if (checkTask()) {
    console.log(`Task "${taskName}" already exists, skipping creation.`);
    return true;
  }

  try {
    console.log(`Creating task "${taskName}" for autostart with flag "${launchArgs}"...`);
    const cmd = `schtasks /Create /TN "${taskName}" /TR "\"${exePath}\" ${launchArgs}" /SC ONLOGON /RL HIGHEST`;
    execSync(cmd); // Show output/errors in console
    console.log('Task created successfully!');
    return true;
  } catch (err: any) {
    console.error('Failed to create task:', err.message);
    return false;
  }
}

export function deleteTask(): boolean {
  try {
    console.log(`Deleting task "${taskName}"...`);
    const cmd = `schtasks /Delete /TN "${taskName}" /F`;
    execSync(cmd);
    console.log('Task deleted successfully!');
    return true;
  } catch (err: any) {
    console.error('Failed to delete task:', err.message);
    return false;
  }
}

export function checkTask(): boolean {
  try {
    const cmd = `schtasks /Query /TN "${taskName}"`;
    execSync(cmd, { stdio: 'ignore' }); // Only check existence, no output
    return true;
  } catch {
    return false;
  }
}
