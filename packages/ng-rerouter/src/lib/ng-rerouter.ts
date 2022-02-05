import {Command} from "commander";
import {generateRoutes} from './routesGenerator';

const program = new Command();

program
  .name('ng-rerouter')
  .description('File Based Routing for Angular Application')
  .version('0.0.1');

program.command('generate')
  .description('Generates routes for angular given project')
  .option('-p, --tsconfig', 'typescript project file', "tsconfig.app.json")
  .option('-o, --output', "Where to store the generated routes?")
  .option('-r, --pages', "root directory for pages")
  .action((str, options) => {
    generateRoutes(options.tsconfig, options.output, options.pages);
  });

program.parse();
