import type { PlatformOSType } from 'react-native';
import { createRulePatternParser } from '../parsers/theme.parser';
import type {
  Rule,
  RuleResolver,
  RuleResult,
  TailwindConfig,
  ThemeContext,
} from '../types/config.types';
import type { ParsedRule } from '../types/parser.types';
import type { __Theme__ } from '../types/theme.types';
import { flattenColorPalette } from '../utils/theme-utils';
import { resolveThemeValue } from './rule-resolver';
import { createThemeFunction } from './theme.function';

export function createThemeContext<Theme extends __Theme__ = __Theme__>({
  theme: themeConfig,
  rules,
}: TailwindConfig<Theme>): ThemeContext {
  const ruleHandlers = new Map<string, (parsedRule: ParsedRule) => RuleResult>();
  // const ruleParsers = new Map<string, ThemeObjectParser>();
  const cache = new Map<string, RuleResult>();
  const platform: PlatformOSType = 'native';
  // Platform.OS == 'android' || Platform.OS == 'ios' ? 'native' : 'web';
  const ctx: ThemeContext = {
    get colors() {
      return flattenColorPalette(themeConfig['colors'] ?? {});
    },

    mode: platform,

    theme: createThemeFunction(themeConfig),

    isSupported(support) {
      return support.includes(platform);
    },

    r(token: ParsedRule) {
      let cacheKey = token.n;
      if (token.m) {
        cacheKey = cacheKey + `/${token.m.value}`;
      }
      if (cache.has(cacheKey)) {
        return cache.get(cacheKey);
      }
      for (const current of rules) {
        const value = resolveRule(current, token);
        if (value) {
          return value;
        }
      }
      return null;
    },
  };
  return ctx;

  function resolveRule(rule: Rule<Theme>, parsedRule: ParsedRule) {
    const resolver = getRuleHandler(rule);
    const nextToken = resolver(parsedRule);

    if (nextToken) {
      cache.set(parsedRule.n, nextToken);
      return nextToken;
    }
  }

  function getRuleResolver(rule: Rule<Theme>): RuleResolver<Theme> {
    if (typeof rule[2] == 'function') {
      return rule[2];
    }
    const section = rule[1];
    if (typeof section == 'object') {
      return (_) => {
        return section;
      };
    }
    return resolveThemeValue(rule[0], section, rule[2])[2];
  }
  function getRuleHandler(rule: Rule<Theme>) {
    const key = JSON.stringify(rule);
    if (ruleHandlers.has(key)) {
      return ruleHandlers.get(key)!;
    }
    const parser = createRulePatternParser(rule[0]);
    const handler = (parsedRule: ParsedRule) => {
      if (parser.run(parsedRule.n).isError) return;
      return getRuleResolver(rule)(ctx, parsedRule);
    };
    ruleHandlers.set(key, handler)!;
    return ruleHandlers.get(key)!;
  }
}
