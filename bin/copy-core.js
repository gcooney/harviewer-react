/*
Copies code from old HAR Viewer to new.
 */
const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");
const glob = require("glob");

const args = process.argv.slice(2);
const hvDir = args[0] || "../harviewer/";

const hvScriptsDir = path.resolve(hvDir, "webapp", "scripts");
if (!fs.pathExistsSync(hvScriptsDir)) {
  throw new Error(`HAR Viewer core "scripts" path ${hvScriptsDir} does not exist`);
}

const patternsToCopy = [
  "core/**",
  "nls/**",
  "tabs/*.html",
  "tabs/ObjectSearch.js",
  "preview/**",
  "json-query/JSONQuery.js",
];

const webappDir = path.resolve(__dirname, "../webapp");
if (!fs.pathExistsSync(webappDir)) {
  throw new Error(`Destination webapp path ${webappDir} does not exist`);
}

patternsToCopy.forEach((pattern) => {
  const files = glob.sync(pattern, {
    cwd: hvScriptsDir,
  });
  files.forEach((file) => {
    const src = path.resolve(hvScriptsDir, file);
    const dest = path.resolve(webappDir, "modules", file);
    if (fs.statSync(src).isFile()) {
      mkdirp.sync(path.dirname(dest));
      fs.copySync(src, dest);
      console.log(`Copied ${src} to ${dest}`);
    }
  });
});
