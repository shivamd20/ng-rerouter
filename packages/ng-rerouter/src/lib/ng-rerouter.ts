import { Command } from 'commander';
import {generateRoutes} from './routesGenerator';

const program = new Command();

program
  .name('ng-rerouter')
  .description('File Based Routing for Angular Application')
  .version('0.0.1');

program
  .description('Generates routes for angular given project')
  .option('--output <path>', "output of the angular application")
  .option('--pageRoot <path>', "pages dir")
  .option('--tsconfig <path>', "tsconfig of the angular application");

program.parse();
const options: Record<string, string> = program.opts();
generateRoutes(options['tsconfig'], options['output'], options['pageRoot']);

console.log(  `file created at ${options['output']}`)
