import { Command } from 'commander';
import {generateRoutes} from './routesGenerator';
import * as chokidar from "chokidar";

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
  chokidar.watch(options['pageRoot']).on('all', (event, path) => {
    generateRoutes(options['tsconfig'], options['output'], options['pageRoot']);
  });
}
