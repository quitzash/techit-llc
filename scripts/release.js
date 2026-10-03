// Build + publish in the one order that can't hit
// "Your local changes would be overwritten by merge".
//
// The problem it solves: public/css/tailwind.css and public/js/icons.js are
// tracked build artifacts. Building dirties them, and any pull attempted
// *before* they're committed is refused. A GUI that auto-pulls on focus hits
// exactly that. So: build -> commit -> pull --rebase -> push, never the reverse.
//
// Run with: npm run release [-- "commit message"]

const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function git(args, opts = {}) {
  const out = execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: opts.quiet ? ['ignore', 'pipe', 'pipe'] : 'inherit',
  });
  // With stdio:'inherit' execFileSync returns null, not a string.
  return typeof out === 'string' ? out.trim() : '';
}

function hasStagedOrDirty() {
  return git(['status', '--porcelain'], { quiet: true }).length > 0;
}

function currentBranch() {
  return git(['rev-parse', '--abbrev-ref', 'HEAD'], { quiet: true });
}

function step(n, total, label) {
  console.log(`\n[${n}/${total}] ${label}`);
}

const msgArg = process.argv.slice(2).filter((a) => a !== '--');
const message = msgArg.length ? msgArg.join(' ') : `build: ${currentBranch()}`;

const TOTAL = 5;

step(1, TOTAL, 'Building icons + CSS');
execFileSync(process.execPath, [path.join(__dirname, 'generate-icons.js')], {
  cwd: ROOT, stdio: 'inherit',
});
// Invoke tailwind's CLI with node directly. Shelling out to `npx`/`*.cmd`
// fails on Windows under Node >= 22 with spawn EINVAL.
const TAILWIND_CLI = path.join(ROOT, 'node_modules', 'tailwindcss', 'lib', 'cli.js');
if (!fs.existsSync(TAILWIND_CLI)) {
  console.error('   tailwindcss not installed - run: npm install');
  process.exit(1);
}
execFileSync(process.execPath, [
  TAILWIND_CLI,
  '-i', './src/input.css',
  '-o', './public/css/tailwind.css',
  '--minify',
], { cwd: ROOT, stdio: 'inherit' });

step(2, TOTAL, 'Staging changes');
git(['add', '-A']);

if (!hasStagedOrDirty()) {
  console.log('   nothing to commit - generated files already current');
} else {
  step(3, TOTAL, `Committing ("${message}")`);
  git(['commit', '-m', message]);
  // Nothing left to block a merge now.
} 

step(4, TOTAL, 'Pulling (rebase, autostash)');
try {
  const out = git(['pull', '--rebase', '--autostash'], { quiet: true });
  console.log('   ' + (out || 'Already up to date.'));
} catch (err) {
  // Autostash can still conflict on reapply; report it loudly rather than
  // pushing something half-applied.
  console.error('   pull failed - resolve the conflict, then re-run npm run release');
  console.error(String(err.stderr || err.stdout || err.message));
  process.exit(1);
}

step(5, TOTAL, 'Pushing');
git(['push']);

console.log('\nPublished. Run: npm start');