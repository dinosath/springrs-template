import { spawnSync } from 'node:child_process';
import { createConnection } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function checkPort(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection({ port, host });
    socket.setTimeout(2000);
    socket.on('connect', () => { socket.destroy(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => { socket.destroy(); resolve(false); });
  });
}

async function waitForPort(port: number, host = 'localhost', maxMs = 30000): Promise<void> {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    if (await checkPort(port, host)) return;
    await new Promise<void>(r => setTimeout(r, 1000));
  }
  throw new Error(`MockServer did not become available on port ${port} within ${maxMs / 1000}s`);
}

export default async function globalSetup() {
  const mockRunning = await checkPort(1080, 'localhost');
  if (!mockRunning) {
    console.log('\n[global-setup] MockServer not found — starting via Docker...');
    // docker-compose.yml lives one level up from frontend/
    const projectRoot = join(__dirname, '..');
    const result = spawnSync(
      'docker-compose',
      ['--profile', 'mock', 'up', '-d', 'mockserver'],
      { cwd: projectRoot, stdio: 'inherit' },
    );
    if (result.status !== 0) {
      throw new Error('[global-setup] Failed to start mockserver — docker-compose exited with ' + result.status);
    }
    await waitForPort(1080);
    console.log('[global-setup] MockServer is ready on port 1080\n');
  } else {
    console.log('[global-setup] MockServer already running on port 1080');
  }
}
