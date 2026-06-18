'use strict';

const { execSync } = require('child_process');
const { DEFAULT_PORT } = require('../server.js');

const port = Number(process.env.PORT) || DEFAULT_PORT;

/**
 * @param {number} targetPort
 * @returns {number[]}
 */
function findListeningPidsWindows(targetPort) {
  let output = '';
  try {
    output = execSync(`netstat -ano | findstr :${targetPort}`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
  } catch {
    return [];
  }

  const pids = new Set();

  for (const line of output.split('\n')) {
    if (!line.includes('LISTENING')) {
      continue;
    }
    const parts = line.trim().split(/\s+/);
    const pid = Number(parts[parts.length - 1]);
    if (Number.isInteger(pid) && pid > 0) {
      pids.add(pid);
    }
  }

  return [...pids];
}

/**
 * @param {number} targetPort
 * @returns {number[]}
 */
function findListeningPidsUnix(targetPort) {
  try {
    const output = execSync(`lsof -ti tcp:${targetPort} -sTCP:LISTEN`, {
      encoding: 'utf8',
      stdio: ['pipe', 'pipe', 'ignore'],
    });
    return output
      .split('\n')
      .map((value) => Number(value.trim()))
      .filter((pid) => Number.isInteger(pid) && pid > 0);
  } catch {
    return [];
  }
}

/**
 * @param {number} targetPort
 */
function freePort(targetPort) {
  const pids = process.platform === 'win32' ? findListeningPidsWindows(targetPort) : findListeningPidsUnix(targetPort);

  if (pids.length === 0) {
    // eslint-disable-next-line no-console -- CLI feedback
    console.log(`Port ${targetPort} is already free.`);
    return;
  }

  for (const pid of pids) {
    if (process.platform === 'win32') {
      execSync(`taskkill /PID ${pid} /F`, { stdio: 'inherit' });
    } else {
      execSync(`kill -TERM ${pid}`, { stdio: 'inherit' });
    }
    // eslint-disable-next-line no-console -- CLI feedback
    console.log(`Stopped process ${pid} on port ${targetPort}.`);
  }
}

freePort(port);
