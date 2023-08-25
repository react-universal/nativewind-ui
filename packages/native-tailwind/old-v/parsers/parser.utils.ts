import { ClassNameToken, ParsedRule } from './types';

export function parseClassNameTokens(...tokens: ClassNameToken[]): string {
  return tokens.reduce((prev, current, currentIndex) => {
    prev += current.name;
    if (currentIndex == tokens.length - 1) return prev;
    return prev;
  }, ``);
}

export function parsedRuleToString(rule: ParsedRule, mediaRules: string[]) {
  const fixedPoints = rule.v.reduce(
    (prev, current) => {
      if (mediaRules.includes(current)) {
        prev.prefix += `${current}:`;
      } else {
        prev.suffix += `:${current}`;
      }
      return prev;
    },
    {
      prefix: '.',
      suffix: '',
    },
  );
  return `${fixedPoints.prefix}${rule.i ? '!' : ''}${rule.n}${fixedPoints.suffix}`;
}