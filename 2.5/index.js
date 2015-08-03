if (process.env.NODE__PROCESS_TITLE) {
    process.title = process.env.NODE__PROCESS_TITLE;
}
var fs            = require('fs');
var os            = require('os');
var path          = require('path');
var crypto        = require('crypto');
var child_process = require('child_process');

const ROOTDIR_PATH = path.join(__dirname);
const PKGJSON_PATH = path.join(ROOTDIR_PATH, 'package.json');
const PKGHASH_PATH = path.join(ROOTDIR_PATH, '.pkghash');
const BABELRC_PATH = path.join(ROOTDIR_PATH, '.babelrc');
const MAIN_PATH    = path.join(ROOTDIR_PATH, 'application', 'main.js');

var pkgHashPrev   = null;
var pkgHash       = crypto.createHash('sha1');
var pkgJsonString = fs.readFileSync(PKGJSON_PATH, {encoding: 'utf8'});
var pkgJsonData   = JSON.parse(pkgJsonString);
var procResult;

pkgHash.update(pkgJsonString);
pkgHash = pkgHash.digest('hex');

try {
    pkgHashPrev = fs.readFileSync(PKGHASH_PATH, {encoding: 'utf8'});
} catch (err) {
    console.error(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 20,
        "msg"      : '[package.json hash checker] .pkghash file does not exist',
        "time"     : new Date(),
        "v"        : 0
    }));
    pkgHashPrev = null;
}

if (pkgHashPrev !== pkgHash) {
    console.log(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 30,
        "msg"      : '[package.json hash checker] MISMATCH',
        "time"     : new Date(),
        "v"        : 0
    }));
    console.log(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 30,
        "msg"      : '[package.json hash checker] npm install EXECUTING',
        "time"     : new Date(),
        "v"        : 0
    }));

    procResult = child_process.spawnSync('npm', ['install'], {
        cwd   : ROOTDIR_PATH,
        stdio : process.env.NODE_ENV === 'production'
                ? ['ignore', 'ignore', 'ignore']
                : ['ignore', process.stdout, process.stderr]
    });
    if (procResult.error) {
        console.error(JSON.stringify({
            "name"     : pkgJsonData.name,
            "hostname" : os.hostname(),
            "pid"      : process.pid,
            "level"    : 50,
            "msg"      : '[package.json hash checker] npm install ERROR',
            "err" : {
                "name"    : procResult.error.name    || 'Error',
                "message" : procResult.error.message || '',
                "stack"   : procResult.error.stack   || ''
            },
            "time" : new Date(),
            "v"    : 0
        }));
    } else {
        console.log(JSON.stringify({
            "name"     : pkgJsonData.name,
            "hostname" : os.hostname(),
            "pid"      : process.pid,
            "level"    : 30,
            "msg"      : '[package.json hash checker] npm install COMPLETE',
            "time"     : new Date(),
            "v"        : 0
        }));
        fs.writeFileSync(PKGHASH_PATH, pkgHash, {encoding: 'utf8'});
    }

} else {
    console.log(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 30,
        "msg"      : '[package.json hash checker] MATCH',
        "time"     : new Date(),
        "v"        : 0
    }));
    console.log(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 30,
        "msg"      : '[package.json hash checker] unchanged, so no npm install will be run',
        "time"     : new Date(),
        "v"        : 0
    }));
}

if (!process.env.BABEL_CACHE_PATH && process.env.BABEL_DISABLE_CACHE !== '1') {
    process.env.BABEL_CACHE_PATH = path.join(ROOTDIR_PATH, '.babel_cache.json');
}

var babelrc;
var babelRegisterFilename;

try {
    babelrc = fs.readFileSync(BABELRC_PATH, {encoding: 'utf8'});
    if (!babelrc) {
        throw new Error('no babelrc found.');
    }
    babelrc = JSON.parse(babelrc);
    if (!babelrc) {
        throw new Error('malformed .babelrc');
    }



    require('babel/register', {

    })
} catch (err) {
    console.error(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 20,
        "msg"      : '[babel config] .babelrc not found or malformed.',
        "time"     : new Date(),
        "v"        : 0
    }));
}

try {
    babelRegisterFilename = require.resolve('babel/register');
    if (!babelRegisterFilename) {
        throw new Error('[babel config] babel register not installed.');
    }
} catch (err) {
    console.error(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 20,
        "msg"      : '[babel config] module "babel/register" not found.',
        "time"     : new Date(),
        "v"        : 0
    }));
}

if (babelrc && babelRegisterFilename) {
    require('babel/register', babelrc);
} else {
    console.error(JSON.stringify({
        "name"     : pkgJsonData.name,
        "hostname" : os.hostname(),
        "pid"      : process.pid,
        "level"    : 20,
        "msg"      : '[babel config] not applying babel.',
        "time"     : new Date(),
        "v"        : 0
    }));
}

console.log(JSON.stringify({
    "name"     : pkgJsonData.name,
    "hostname" : os.hostname(),
    "pid"      : process.pid,
    "level"    : 30,
    "msg"      : '[package.json hash checker] requiring main module "' + MAIN_PATH + '"',
    "time"     : new Date(),
    "v"        : 0
}));

module.exports = require(MAIN_PATH);
