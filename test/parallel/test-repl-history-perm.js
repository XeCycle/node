'use strict';

const common = require('../common');

if (common.isWindows) {
  console.log('1..0 # Skipped: Win32 uses ACLs for file permissions, ' +
              'modes are always 0666 and says nothing about group/other ' +
              'read access.');
  return;
}

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const child_process = require('child_process');

// Invoking the REPL should create a repl history file at the specified path
// and a mode not readable by group/others.

common.refreshTmpDir();
const replHistoryPath = path.join(common.tmpDir, '.node_repl_history');

child_process.execFileSync(process.execPath, ['-i'], {
  env: { NODE_REPL_HISTORY: replHistoryPath },
  stdio: ['ignore', 'pipe', 'inherit']
});

const stat = fs.statSync(replHistoryPath);
assert.strictEqual(
  stat.mode & 0o77, 0,
  'REPL history file should not be accessible by group/others');
