import * as P from '@universal-labs/css/parser';
import { parseClassNameTokens } from './parser.utils';
import { ParsedRule, ClassGroupToken, ClassNameToken } from '../../types/parser.types';
import { matchArbitrary } from '../common.parsers';

const regexIdent = /^[_a-z0-9A-Z-!]+/;
const regexVariantIdent = /^[_a-z0-9A-Z-!]+[:]/;

const matchColorModifier = P.sequenceOf([
  P.char('/'),
  P.choice([P.digits, matchArbitrary]),
]).map((x) => ({
  modifier: x[1],
}));

const parseVariants = P.many(P.regex(regexVariantIdent));
const parseClassFeature = P.regex(regexIdent);

const parseClassName = P.sequenceOf([
  parseVariants,
  P.maybe(parseClassFeature),
  P.maybe(matchColorModifier),
]).map((x): ClassNameToken => {
  const name = x[1] ?? '';
  return {
    type: 'CLASS_NAME',
    name: name.replace(/!/g, ''),
    important: name.includes('!') || x[0].some((y) => y.includes('!')),
    variant: x[0].length > 0,
    variants: x[0].filter((y) => !!y).map((z) => z.replace(/[!:]+/g, '')),
    modifiers: x[2],
  };
});

const parseGroupValues = P.recursiveParser(() => P.choice([parseClassGroup, parseClassName]));

const parseClassGroup = P.sequenceOf([
  P.maybe(parseClassName).map(
    (x): ClassNameToken =>
      x ?? {
        type: 'CLASS_NAME',
        important: false,
        name: '',
        variants: [],
        variant: false,
        modifiers: null,
      },
  ),
  P.char('('),
  P.separatedBySpace(parseGroupValues),
  P.char(')'),
]).map(
  (x): ClassGroupToken => ({
    ...x[0],
    name:
      x[0].name != '' && !x[0].variant && !x[0].name.endsWith('-')
        ? `${x[0].name}-`
        : x[0].name,
    type: 'GROUP',
    list: x[2],
  }),
) as P.Parser<ClassGroupToken>;

export const parseRawClassTokens = P.coroutine((run) => {
  let classNames: ParsedRule[] = [];
  parseClasses();
  return classNames;

  function parseNextToken() {
    return run(parseClassName);
  }

  function parseGroups() {
    return run(parseClassGroup);
  }

  function parseClasses() {
    const canContinue = run(P.maybe(P.peek));
    if (!canContinue) return;
    if (canContinue == ' ') run(P.whitespace);
    let groups: ClassGroupToken | null = null;
    const baseToken = parseNextToken();
    const nextChar = run(P.lookAhead(P.peek));
    if (nextChar == '(') {
      groups = parseGroups();
    }
    const classes = createRule(baseToken, groups);
    classNames = classNames.concat(classes);
    return parseClasses();
  }

  function createRule(
    baseToken: ClassNameToken,
    groups: ClassGroupToken | null,
  ): ParsedRule[] {
    if (!groups) {
      return [
        {
          n: baseToken.name,
          v: baseToken.variants,
          i: baseToken.important,
        },
      ];
    }
    const classNames = groups.list.flatMap((rule): ParsedRule[] => {
      if (rule.type == 'GROUP') {
        if (rule.variant) {
          return createRule(
            {
              ...baseToken,
              variants: [...baseToken.variants, ...rule.variants],
              name: rule.name,
              important: rule.important || baseToken.important,
            },
            rule,
          );
        }
        return createRule(baseToken, rule);
      }
      // console.log('BB: ', { baseToken, rule });
      let newToken = { ...baseToken };
      if (!newToken.variant && !newToken.name.endsWith('-')) {
        newToken.name = `${newToken.name}-`;
      }
      return [
        {
          n: parseClassNameTokens(newToken, rule),
          v: baseToken.variants,
          i: baseToken.important || rule.important,
          m: rule.modifiers,
        },
      ];
    });
    return classNames;
  }
});