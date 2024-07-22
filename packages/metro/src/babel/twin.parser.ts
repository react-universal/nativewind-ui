import generate from '@babel/generator';
import { parse, ParseResult } from '@babel/parser';
import traverse from '@babel/traverse';
import * as t from '@babel/types';
import {
  addOrderToJSXChilds,
  compileMappedAttributes,
  createJSXElementHandler,
  RuntimeComponentEntry,
  StyledPropEntries,
} from '@native-twin/babel/jsx-babel';
import type { RuntimeTW } from '@native-twin/core';

export const parseDocument = (
  fileName: string,
  version: number,
  code: string,
  tw: RuntimeTW,
) => {
  const compiledClasses: StyledPropEntries['entries'] = [];
  const twinComponentStyles = new Map<string, RuntimeComponentEntry[]>();
  try {
    const parsed = parse(code, {
      plugins: ['jsx', 'typescript'],
      sourceType: 'module',
      errorRecovery: true,
    });
    traverse(parsed, {
      JSXElement: (path, state) => {
        const handler = createJSXElementHandler(path);
        addOrderToJSXChilds(handler);

        const classNames = handler.openingElement.extractClassNames();
        const attributes = compileMappedAttributes([...classNames], tw);
        const componentStyles: RuntimeComponentEntry[] = [];
        const uid = path.scope.generateUidIdentifier(fileName);
        const id = `${uid.name}-${version}`;
        for (const prop of attributes) {
          handler.openingElement.addStyledProp(id, prop);
          compiledClasses.push(...prop.entries);
          const runtime = handler.openingElement.styledPropsToObject(prop);
          componentStyles.push(runtime[1]);
        }
        if (componentStyles.length > 0) {
          const callProp = t.callExpression(
            t.identifier('get_compiled____styles___'),
            [],
          );
          handler.openingElement.openingElement.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('getTwinSheet'),
              t.jsxExpressionContainer(callProp),
            ),
          );
        }
        handler.openingElement.openingElement.attributes.push(
          t.jsxAttribute(t.jsxIdentifier('_twinComponentID'), t.stringLiteral(id)),
        );
        twinComponentStyles.set(id, componentStyles);
      },
    });

    // traverse(parsed, {
    //   Program(program) {
    //     if (compiledClasses.length) {
    //       const variable = t.variableDeclaration('const', [
    //         t.variableDeclarator(t.identifier('__twinComponentStyles')),
    //       ]);
    //       program.insertAfter(variable);
    //     }
    //   },
    // });

    const generatedCode = generate(parsed);
    // console.log('RESULT: ', generatedCode.code);
    // console.log('STYLES: ', twinComponentStyles);
    return { code: generatedCode.code, compiledClasses, twinComponentStyles };
  } catch (e: any) {
    console.log('ERROR: ', {
      message: e.message,
      code,
    });
    return null;
  }
};

export function parsedToCode(parsed: ParseResult<t.File>) {
  const result = generate(parsed);
  return result;
}