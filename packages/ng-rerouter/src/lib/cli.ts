#!/usr/bin/env node

import { Command } from 'commander';
import * as chokidar from "chokidar";
import { generateRoutes } from './routesGenerator';

const program = new Command();

program
  .name('ng-rerouter')
  .description('File Based Routing for Angular Application')
  .version('0.0.1');

program
  .description('Generates routes for angular given project')
  .option('--output <path>', "output of the angular application")
  .option('--pageRoot <path>', "pages dir")
  .option('--tsconfig <path>', "tsconfig of the angular application")
  .option('--watch [boolean]', "watch for file changes", false);
;

program.parse();
const options: Record<string, string> = program.opts();
generateRoutes(options['tsconfig'], options['output'], options['pageRoot']);

console.log(  `file created at ${options['output']}`)

if(options['watch']) {
  console.log("Watching for file changes...")
  chokidar.watch(options['pageRoot'], {
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100
    }
  }).on('all', (event, path) => {
    console.time("rebuilding")
    generateRoutes(options['tsconfig'], options['output'], options['pageRoot']);
    console.timeEnd("rebuilding")
  });
}
