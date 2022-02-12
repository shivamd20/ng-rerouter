import {
  ArrayLiteralExpression,
  Directory,
  Project,
  PropertyAssignment,
  SourceFile,
  SyntaxKind,
  Writers
} from 'ts-morph';

function doesContainRouterOutlet(file: SourceFile): boolean {
  const decor = file.getDefaultExportSymbol()?.getDeclarations()[0].asKind(SyntaxKind.ClassDeclaration)?.getDecoratorOrThrow('Component')!;
  const templateUrlProperty = decor.getArguments()[0].asKind(SyntaxKind.ObjectLiteralExpression)!.getProperty('templateUrl') as PropertyAssignment;

  if (templateUrlProperty) {
    const str = templateUrlProperty.getInitializer()?.asKind(SyntaxKind.StringLiteral)?.getLiteralValue();
    if (str === './index.route.html') {
      const htmlFile = file.getDirectory().getSourceFile('index.route.html');
      return htmlFile?.getText().includes('<router-outlet>') ?? false;
    } else {
      throw  new Error(`HTML Filename ${str} should match the component's route name`);
    }
  } else {
    const templateProperty = decor.getArguments()[0].asKind(SyntaxKind.ObjectLiteralExpression)!.getProperty('template') as PropertyAssignment;
    const str = templateProperty.getInitializer()?.getText()!;
    return str.includes('<router-outlet>');
  }
}

function deleteAutoGeneratedFiles(dir: Directory) {
  dir.getDescendantSourceFiles().filter(file => file.getBaseName() === '__routes.ts').forEach(file => {
    console.log(`deleting ${file.getFilePath()}`);
    file.deleteImmediatelySync();
  });
}

function getFilesWithRouterOutlet(dir: Directory) {
  return dir
    .getDescendantSourceFiles()
    .filter(file => {
      if (file.getBaseName().endsWith('index.route.ts')) {
        return doesContainRouterOutlet(file);
      }
      return false;
    });
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateFileName(path: string, index: number) {
  const segments = path.split('/');
  return capitalizeFirstLetter(`${segments[segments.length - 1].replace(/[^0-9a-z]/gi, '')}_${index}`);
}


function isAdditionalConfigDefined(file: SourceFile) {
  return file.getExportSymbols().some(exSymbol => exSymbol.getName() === 'routeConfig');
}

function spreadAdditionalRouteConfig(importSymbolName: string, outputFile: SourceFile, filePath: string, arrayLiteralExpression: ArrayLiteralExpression) {
  const routeConfigSymbol = `${importSymbolName}_routeConfig`;

  outputFile.addImportDeclaration({
    moduleSpecifier: filePath,
    namedImports: [`routeConfig as ${routeConfigSymbol}`]
  });

  arrayLiteralExpression.getElements()[arrayLiteralExpression.getElements().length - 1]
    .asKind(SyntaxKind.ObjectLiteralExpression)
    ?.addSpreadAssignment({ expression: `${routeConfigSymbol}` });
}

function createRootRoutesFile(dir: Directory) {
  const outputFile = dir.createSourceFile('__routes.ts',
    `
import { Routes } from '@angular/router';
export const routes: Routes = [
];
`, { overwrite: true });
  outputFile.saveSync();
}

function createRoutesFile(file: SourceFile) {
  const outputFile = file.getDirectory().createSourceFile('__routes.ts',
    `
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export default class RoutingModule { }
`, { overwrite: true });
  outputFile.saveSync();
}

function addFileMapping(file: SourceFile, index: number) {
  const routesFile = getRoutesFile(file.getDirectory())!;
  const filePath = routesFile.getRelativePathAsModuleSpecifierTo(file);

  const importSymbolName = generateFileName(file.getBaseNameWithoutExtension(), index);

  routesFile.addImportDeclaration({
    moduleSpecifier: filePath,
    defaultImport: importSymbolName
  });

  const arrayLiteralExpression = routesFile.getVariableDeclaration('routes')?.getInitializer()?.asKind(SyntaxKind.ArrayLiteralExpression)!;

  const pathWithExt = routesFile.getRelativePathTo(file);

  const path = pathWithExt.endsWith('index.route.ts')
    ? pathWithExt.substring(0, pathWithExt.length - 'index.route.ts'.length - 1)
    : pathWithExt.substring(0, pathWithExt.length - '.route.ts'.length);

  arrayLiteralExpression.addElement(
    Writers.object({
      path: (writer) => writer.quote(path),
      component: importSymbolName
    })
  );

  if (isAdditionalConfigDefined(file)) {
    spreadAdditionalRouteConfig(importSymbolName, routesFile, filePath, arrayLiteralExpression);
  }

  routesFile.saveSync();
}

function getRoutesFile(dir: Directory | undefined, rootDir = dir): SourceFile | undefined {

  if (!dir) return undefined;

  const file = dir.getSourceFile('__routes.ts');
  if (file) {
    return file;
  } else {
    const parent = dir.getParent();
    if (parent) {
      return getRoutesFile(parent, rootDir);
    } else {
      return undefined;
    }
  }
}

/**
 * @param tsConfigFilePath
 * @param outputPath
 * @param pagesRootDirectory
 */
export function generateRoutes(
  tsConfigFilePath: string = 'tsconfig.app.json',
  outputPath: string = 'src/page.routing.ts',
  pagesRootDirectory: string = 'src/pages'
) {
  const project = new Project({
    tsConfigFilePath: tsConfigFilePath
  });
  project.addSourceFilesAtPaths(pagesRootDirectory + '/**/*');
  const dir = project.getDirectoryOrThrow(pagesRootDirectory)!;
  deleteAutoGeneratedFiles(dir);
  getFilesWithRouterOutlet(dir).forEach(file => {
    createRoutesFile(file);
  });

  createRootRoutesFile(dir);

  dir.getDescendantSourceFiles().filter(file => file.getBaseName().endsWith('.route.ts')).forEach((file, index) => {
    addFileMapping(file, index);
  });

  dir.getDescendantSourceFiles().filter(file => file.getBaseName().endsWith('__routes.ts')).forEach((file, index) => {


    const routesFile = getRoutesFile(file.getDirectory().getParent())!;


    if (routesFile) {

      const filePath = routesFile.getRelativePathAsModuleSpecifierTo(file);

      const importSymbolName = generateFileName(file.getBaseNameWithoutExtension(), index);

      routesFile.addImportDeclaration({
        moduleSpecifier: filePath,
        defaultImport: importSymbolName
      });

      const arrayLiteralExpression = routesFile.getVariableDeclaration('routes')?.getInitializer()?.asKind(SyntaxKind.ArrayLiteralExpression)!;

      const path = routesFile.getRelativePathTo(file.getDirectory());


      arrayLiteralExpression.addElement(
        Writers.object({
          path: (writer) => writer.quote(path),
          loadChildren: (writer) => {

            writer.write(`() => import("${filePath}").then(m => m.default)`);

          }
        })
      );

      routesFile.saveSync();
    }
  });
}