const Module = require('node:module');
const { createRequire } = Module;
const path = require('node:path');
const { config } = require("./index.ts");

function buildRequire(targetPath: string | undefined) {
  if (!targetPath) {
    return require;
  }
  
  return createRequire(path.join(targetPath, 'index.js'));
}

export const hmRequire = buildRequire(config.import.node_path);
export const hmSystemRequire = buildRequire(config.import.system_path);
