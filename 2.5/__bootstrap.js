var MAIN_PATH;
;(function(){

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

var pkgHashPrev   = null;
var pkgHash       = crypto.createHash('sha1');
var pkgJsonString = fs.readFileSync(PKGJSON_PATH, {encoding: 'utf8'});
var pkgJsonData   = JSON.parse(pkgJsonString);
var procResult;

MAIN_PATH = pkgJsonData.main;
if (!MAIN_PATH) {
    throw new Error('[__bootstrap] missing required "main" property in package.json');
    process.exit(1);
}

pkgHash.update(pkgJsonString);
pkgHash = pkgHash.digest('hex');

var logger = {
    info : function logInfo() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift('[__bootstrap]');
        console.log.apply(console, args);
    },
    error : function logError() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift('[__bootstrap][[ERROR]]');
        console.error.apply(console, args);
    }
};

try {
    pkgHashPrev = fs.readFileSync(PKGHASH_PATH, {encoding: 'utf8'});
} catch (err) {
    logger.info('[package.json hash checker]', '.pkghash file does not exist');
    pkgHashPrev = null;
}

if (pkgHashPrev !== pkgHash) {
    logger.info('[package.json hash checker]', 'MISMATCH');
    logger.info('[package.json hash checker]', 'npm install', 'STARTING');

    procResult = child_process.spawnSync('npm', ['install'], {
        cwd   : ROOTDIR_PATH,
        stdio : process.env.NPM__SILENT && process.env.NPM__SILENT.toLowerCase() === 'true'
            ? 'ignore'
            : ['ignore', process.stdout, process.stderr]
    });
    if (procResult.error) {
        logger.error('[package.json hash checker]', 'during npm install', procResult.error.stack);
    } else {
        logger.info('[package.json hash checker]', 'npm install', 'FINISHED');
        fs.writeFileSync(PKGHASH_PATH, pkgHash, {encoding: 'utf8'});
    }

} else {
    logger.info('[package.json hash checker]', 'MATCH');
}

if (!process.env.BABEL_CACHE_PATH && process.env.BABEL_DISABLE_CACHE !== '1') {
    process.env.BABEL_CACHE_PATH = path.join(ROOTDIR_PATH, '.babel_cache.json');
}

var babelrc;
var babelrcRegExp;
var babelRegisterFilename;

try {
    babelrc = fs.readFileSync(BABELRC_PATH, {encoding: 'utf8'});
    if (!babelrc) {
        throw new Error('no .babelrc found');
    }
    babelrc = JSON.parse(babelrc);
    if (!babelrc) {
        throw new Error('malformed .babelrc');
    }
} catch (err) {
    logger.error('[babel config]', err.stack);
}

if (babelrc && typeof babelrc.ignore === 'string') {
    try {
        babelrcRegExp = new RegExp(babelrc.ignore);
        babelrc.ignore = babelrcRegExp;
    } catch (err) {
        logger.error('[babel config] babelrc.ignore probably isn\'t a regular expression.');
    }
}

try {
    babelRegisterFilename = require.resolve('babel/register');
    if (!babelRegisterFilename) {
        throw new Error('[babel config] cannot resolve module "babel/register"');
    }
} catch (err) {
    logger.error('[babel config]', 'module "babel/register" not found', err.stack);
}

if (babelrc && babelRegisterFilename) {
    logger.info('[babel config]', 'applying babel');
    require('babel/register', babelrc);
} else {
    logger.error('[babel config]', 'not applying babel');
}

logger.info('[package.json hash checker]', 'requiring main module "' + MAIN_PATH + '"');

}).call(this);
module.exports = require(path.resolve(MAIN_PATH));
