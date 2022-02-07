import { Project, SourceFile, SyntaxKind, VariableDeclarationKind, Writers } from 'ts-morph';

function isAdditionalConfigDefined(file: SourceFile) {
  return file.getExportSymbols().some(exSymbol => exSymbol.getName() === 'routeConfig');
}

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function generateFileName(path: string, index: number) {
  const segments = path.split("/");
  return capitalizeFirstLetter(`${segments[segments.length - 1].replace(/[^0-9a-z]/gi, '')}_${index}`);
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
    tsConfigFilePath: tsConfigFilePath,
  });

  const outputFile = project.createSourceFile(outputPath, undefined, {
    overwrite: true,
  });
  project.addSourceFilesAtPaths(pagesRootDirectory + '/**/*');
  const dir = project.getDirectoryOrThrow(pagesRootDirectory)!;
  outputFile.addImportDeclaration({
    moduleSpecifier: '@angular/router',
    namedImports: ['Routes'],
  });

  const arrayLiteralExpression = outputFile
    .addVariableStatement({
      declarationKind: VariableDeclarationKind.Const,
      declarations: [
        {
          name: 'routes',
          initializer: '[ ]',
          type: 'Routes',
        },
      ],
    })
    .getDeclarations()[0]
    .getInitializerIfKindOrThrow(SyntaxKind.ArrayLiteralExpression);
  outputFile.addExportDeclaration({
    namedExports: ['routes'],
  });
  dir
    .getDescendantSourceFiles()
    .filter( file => file.getFilePath().endsWith(".route.ts"))
    .sort((dir1, dir2) => dir2.getFilePath().localeCompare(dir1.getFilePath()))
    .forEach((file, index) => {
      const filePath = outputFile.getRelativePathAsModuleSpecifierTo(file);
      if (filePath.length !== 0) {


        const pathWithExt = dir.getRelativePathTo(file);

        const path = pathWithExt.endsWith('index.route.ts')
          ? pathWithExt.substring(0, pathWithExt.length - 'index.route.ts'.length -1 )
          : pathWithExt.substring(0, pathWithExt.length - '.route.ts'.length);


        console.log("Route found: " + file.getFilePath());

        const importSymbolName = generateFileName(path, index);
        outputFile.addImportDeclaration({
          moduleSpecifier: filePath,
          defaultImport: importSymbolName,
        });

        file.getExportDeclarations().map(ex => ex.getNamedExports()).forEach((nx) => {
          console.log(nx.map(n => n.getName()));
        });

        arrayLiteralExpression.addElement(
          Writers.object({
            path: (writer) => writer.quote(path),
            component: importSymbolName,
          })
        );

        if(isAdditionalConfigDefined(file)){
          const routeConfigSymbol = `${importSymbolName}_routeConfig`;

          outputFile.addImportDeclaration({
            moduleSpecifier: filePath,
            namedImports: [`routeConfig as ${routeConfigSymbol}`]
          })

          arrayLiteralExpression.getElements()[arrayLiteralExpression.getElements().length -1]
            .asKind(SyntaxKind.ObjectLiteralExpression)
            ?.addSpreadAssignment({expression: `${routeConfigSymbol}`});
        }
      }
    });
  outputFile.save().catch((e) => console.error(e));
}

