#!/usr/bin/env node
'use strict';

/**
 * Simple CLI for obsidian-webpage-export
 *
 * Behavior:
 * - parse args: --input/-i, --out/-o, --help/-h, --verbose/-v
 * - try to require an export function from common paths:
 *     ../index.js, ../lib/index.js, ../src/index.js, ../dist/index.js
 *   If found and is a function, call it with { input, out, verbose } and await a Promise if returned.
 * - otherwise fallback to running `npm run export -- --input <...> --out <...>`
 *
 * This keeps the CLI generic so it works with different project layouts.
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function printHelp() {
  console.log(`
Usage:
  webpage-export [--input <PATH>] [--out <PATH>] [--verbose]

Options:
  -i, --input    Path to input (e.g. your vault or entry file)
  -o, --out      Output directory or file
  -v, --verbose  Verbose logging
  -h, --help     Show this help
`);
}

function parseArgs(argv) {
  const args = { input: null, out: null, verbose: false, help: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '-i' || a === '--input') {
      args.input = argv[++i];
    } else if (a === '-o' || a === '--out') {
      args.out = argv[++i];
    } else if (a === '-v' || a === '--verbose') {
      args.verbose = true;
    } else if (a === '-h' || a === '--help') {
      args.help = true;
    } else if (a.startsWith('--input=')) {
      args.input = a.split('=')[1];
    } else if (a.startsWith('--out=')) {
      args.out = a.split('=')[1];
    } else if (a === '--') {
      // pass-through; ignore the rest for this simple CLI
      break;
    } else {
      // ignored unknown arg
    }
  }
  return args;
}

async function tryRequireExport() {
  const candidatePaths = [
    path.join(__dirname, '..', 'index.js'),
    path.join(__dirname, '..', 'lib', 'index.js'),
    path.join(__dirname, '..', 'src', 'index.js'),
    path.join(__dirname, '..', 'dist', 'index.js'),
    path.join(process.cwd(), 'index.js'),
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p)) {
        // use require with absolute path
        const mod = require(p);
        // If module itself is function
        if (typeof mod === 'function') return mod;
        // If module exports default or export named function
        if (mod && typeof mod.default === 'function') return mod.default;
        if (mod && typeof mod.export === 'function') return mod.export;
        if (mod && typeof mod.run === 'function') return mod.run;
      }
    } catch (e) {
      // continue to next candidate
      if (e && e.code === 'MODULE_NOT_FOUND') continue;
      // other errors we ignore to keep robust
    }
  }
  return null;
}

function runNpmScriptExport(input, out, verbose) {
  return new Promise((resolve, reject) => {
    const args = ['run', 'export', '--'];
    if (input) { args.push('--input', input); }
    if (out) { args.push('--out', out); }
    if (verbose) { args.push('--verbose'); }

    const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
    const proc = spawn(npmCmd, args, { stdio: 'inherit', shell: false });

    proc.on('close', code => {
      if (code === 0) resolve();
      else reject(new Error('npm run export exited with code ' + code));
    });
    proc.on('error', err => reject(err));
  });
}

(async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.input && !args.out) {
    console.warn('Warning: no --input or --out provided; behavior depends on project defaults.');
  }

  const verbose = args.verbose;

  if (verbose) console.log('[webpage-export] Looking for local export module...');

  try {
    const exporter = await tryRequireExport();
    if (exporter) {
      if (verbose) console.log('[webpage-export] Found local export module. Calling it...');
      try {
        // call according to signatures: exporter(opts) might return Promise or sync
        const maybePromise = exporter({ input: args.input, out: args.out, verbose });
        if (maybePromise && typeof maybePromise.then === 'function') {
          await maybePromise;
        }
        if (verbose) console.log('[webpage-export] Export completed.');
        process.exit(0);
      } catch (err) {
        console.error('[webpage-export] Error while running local exporter:', err);
        process.exit(2);
      }
    } else {
      if (verbose) console.log('[webpage-export] No local export module found. Falling back to `npm run export`.');
      await runNpmScriptExport(args.input, args.out, args.verbose);
      if (verbose) console.log('[webpage-export] npm script export completed.');
      process.exit(0);
    }
  } catch (err) {
    console.error('[webpage-export] Failed to run exporter:', err);
    process.exit(1);
  }
})();