/**
 * Build npm lib
 */
const shell = require('shelljs');
const signale = require('signale');

const { Signale } = signale;
const tasks = [
  'npm run lint',
  'npm run build:gen-files',
  'npm run build:mkdir',
  'npm run build:declaration',
  'node build/build-components.js --color',
  'node build/build-style.js --color',
  'node build/build-style-entry.js --color',
  'node build/build-css-var.js',
  'node build/build-css-non-rem.js',
  'cross-env NODE_ENV=production webpack --color --config build/webpack.build.js',
  'cross-env NODE_ENV=production webpack -p --color --config build/webpack.build.js',
];

tasks.forEach(task => {
  signale.start(task);
  const interactive = new Signale({ interactive: true });
  interactive.pending(task);
  shell.exec(`${task} --silent`);
  interactive.success(task);
});
