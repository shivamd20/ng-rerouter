import {
  Project,
  SyntaxKind,
  VariableDeclarationKind,
  Writers,
} from 'ts-morph';

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
    .sort((dir1, dir2) => dir2.getFilePath().localeCompare(dir1.getFilePath()))
    .forEach((file, index) => {
      const filePath = outputFile.getRelativePathAsModuleSpecifierTo(file);
      if (filePath.length !== 0) {
        const importSymbolName = `module_${index}`;
        outputFile.addImportDeclaration({
          moduleSpecifier: filePath,
          defaultImport: importSymbolName,
        });
        const pathWithExt = dir.getRelativePathTo(file);
        const path = pathWithExt.endsWith('index.ts')
          ? pathWithExt.substring(0, pathWithExt.length - 9)
          : pathWithExt.substring(0, pathWithExt.length - 3);

        arrayLiteralExpression.addElement(
          Writers.object({
            path: (writer) => writer.quote(path),
            component: importSymbolName,
          })
        );
      }
    });
  outputFile.save().catch((e) => console.error(e));
}

generateRoutes();
