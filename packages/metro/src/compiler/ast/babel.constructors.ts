import generate from '@babel/generator';
import template from '@babel/template';
import * as t from '@babel/types';
import * as RA from 'effect/Array';
import { pipe } from 'effect/Function';
import * as Option from 'effect/Option';
import * as Predicate from 'effect/Predicate';
import { cx } from '@native-twin/core';
import { MappedComponent } from '../../utils';
import { AnyPrimitive, JSXMappedAttribute } from '../types/tsCompiler.types';
import { getJSXElementConfig } from './shared.utils';

export const extractClassNameProp = (
  attribute: t.JSXAttribute,
  config: MappedComponent,
): JSXMappedAttribute | null => {
  const validClassNames = Object.entries(config.config);
  if (!t.isJSXAttribute(attribute)) return null;
  if (!t.isJSXIdentifier(attribute.name)) return null;
  const className = validClassNames.find((x) => attribute.name.name === x[0]);
  if (!className) return null;

  if (t.isStringLiteral(attribute.value)) {
    return {
      prop: className[0],
      target: className[1],
      value: {
        literal: attribute.value.value,
        templates: null,
      },
    };
  }
  if (t.isJSXExpressionContainer(attribute.value)) {
    let templates = ``;
    let literal = '';

    if (t.isTemplateLiteral(attribute.value.expression)) {
      const expression = attribute.value.expression;
      literal = cx`${expression.quasis.map((x) => x.value.raw).join(' ')}`;

      if (expression.expressions.length > 0) {
        templates = expression.expressions
          .filter((x) => t.isExpression(x))
          .map((x) => generate(x).code)
          .join(' ');
        templates = `\`${templates}\``;
      }
    }

    if (t.isCallExpression(attribute.value.expression)) {
      templates = generate(attribute.value.expression).code;
    }

    return {
      prop: className[0],
      target: className[1],
      value: {
        literal,
        templates,
      },
    };
  }
  return null;
};

export const extractElementClassNames = (
  attributes: t.JSXAttribute[],
  config: MappedComponent,
): JSXMappedAttribute[] => {
  return attributes
    .map((x) => extractClassNameProp(x, config))
    .filter((x) => x !== null) as JSXMappedAttribute[];
};

export const getJSXMappedAttributes = (
  attributes: t.JSXAttribute[],
  config: MappedComponent,
): JSXMappedAttribute[] => {
  return attributes
    .map((x) => extractClassNameProp(x, config))
    .filter((x) => x !== null) as JSXMappedAttribute[];
};

export const getBabelJSXElementAttrs = (element: t.JSXElement): t.JSXAttribute[] =>
  pipe(
    element.openingElement.attributes,
    RA.filterMap((x) => (isBabelJSXAttribute(x) ? Option.some(x) : Option.none())),
  );

export const getBabelJSXElementAttrByName = (
  attributes: t.JSXAttribute[],
  name: string,
) => {
  return pipe(
    attributes,
    RA.findFirst((x) => {
      if (!isBabelJSXIdentifier(x.name)) return false;
      return x.name.name === name;
    }),
  );
};

export const getBabelJSXElementName = (node: t.JSXElement) => {
  if (t.isJSXIdentifier(node.openingElement.name)) {
    return node.openingElement.name.name;
  }
  return null;
};

export const isBabelJSXAttribute: Predicate.Refinement<t.Node, t.JSXAttribute> = (
  x,
): x is t.JSXAttribute => t.isJSXAttribute(x);

export const isBabelJSXIdentifier: Predicate.Refinement<t.Node, t.JSXIdentifier> = (
  x,
): x is t.JSXIdentifier => t.isJSXIdentifier(x);

export const getBabelElementMappedAttributes = (
  node: t.JSXElement,
): JSXMappedAttribute[] => {
  const attributes = getBabelJSXElementAttrs(node);
  return pipe(
    Option.fromNullable(getBabelJSXElementName(node)),
    Option.flatMap((x) => Option.fromNullable(getJSXElementConfig(x))),
    Option.map((mapped) => getJSXMappedAttributes(attributes, mapped)),
    Option.getOrElse(() => []),
  );
};

export const addAttributesToElement = (
  node: t.JSXElement,
  attribute: { name: string; value: AnyPrimitive },
) => {
  node.openingElement.attributes.push(
    t.jsxAttribute(
      t.jsxIdentifier(attribute.name),
      t.jsxExpressionContainer(template.expression(`${attribute.value}`)()),
    ),
  );
};
