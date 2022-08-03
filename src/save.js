const cache = require('@actions/cache');
const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require('fs');
const path = require('path');

const key = core.getInput('key', { required: true})

async function myexec(script, args) {
  var srcDir = path.dirname(__filename)
  await exec.exec(path.join(srcDir, script), args)
}

function printInfo(s) {
  console.log('\x1b[34m', s, '\x1b[0m')
}

const paths = [
  '/nix/store/',
  '/nix/var/nix/profiles/per-user/' + process.env.USER + '/profile/bin',
  '/nix/var/nix/profiles/default/bin/',
  '/nix/var/nix/profiles/per-user/root/channels'
]

async function prepareSave(cacheKey) {
  if (cacheKey === undefined) {
    printInfo('Preparing save')
    await myexec('core.sh', ['prepare-save'])
  }
}

async function saveCache(cacheKey) {
  if (cacheKey === undefined) {
    printInfo('Saving cache with key: ' + key)
    await cache.saveCache(paths, key)
  }
}

(async function run() {
  printInfo('Preparing save')
  const cacheKey = undefined
  // const cacheKey = core.getState("nix-cache-key");

  await prepareSave(cacheKey)

  await saveCache(cacheKey)

// Run the async function and exit when an exception occurs.
})().catch(e => { console.error(e); process.exit(1) })
