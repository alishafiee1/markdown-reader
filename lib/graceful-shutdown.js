'use strict';

const readline = require('readline');

const SHUTDOWN_TIMEOUT_MS = 5000;

/**
 * Closes the HTTP server on SIGINT/SIGTERM or when the terminal window closes (Windows).
 * @param {import('http').Server} httpServer
 */
function registerGracefulShutdown(httpServer) {
  let isShuttingDown = false;

  /**
   * @param {string} reason
   */
  function shutdown(reason) {
    if (isShuttingDown) {
      return;
    }
    isShuttingDown = true;
    // eslint-disable-next-line no-console -- intentional shutdown log
    console.log(`\nmarkdown-reader: shutting down (${reason})...`);

    httpServer.close((error) => {
      if (error) {
        console.error('shutdown error:', error);
        process.exit(1);
        return;
      }
      process.exit(0);
    });

    setTimeout(() => {
      console.error('markdown-reader: forced exit after timeout');
      process.exit(1);
    }, SHUTDOWN_TIMEOUT_MS).unref();
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGHUP', () => shutdown('SIGHUP'));

  if (process.platform === 'win32' && process.stdin.isTTY) {
    process.stdin.resume();
    readline.createInterface({ input: process.stdin, terminal: false }).on('close', () => {
      shutdown('terminal-closed');
    });
  }
}

module.exports = {
  registerGracefulShutdown,
};
