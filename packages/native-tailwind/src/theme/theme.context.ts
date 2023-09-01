import type { ParsedRule } from '../types/parser.types';
import type { Context, RuleResult, TailwindConfig } from '../types/config.types';
import type { BaseTheme, ThemeConfig, ThemeFunction } from '../types/theme.types';
import { Platform, type PlatformOSType } from 'react-native';
import { RuleHandler } from './Rule';

export function createThemeContext<Theme extends BaseTheme = BaseTheme>({
  theme: themeConfig,
  rules,
}: TailwindConfig<Theme>): Context<Theme> {
  const ruleHandlers: RuleHandler<Theme>[] = [];
  const cache = new Map<string, RuleResult>();
  const platform: PlatformOSType =
    Platform.OS == 'android' || Platform.OS == 'ios' ? 'native' : 'web';
  const ctx: Context<Theme> = {
    mode: platform,
    theme: createThemeFunction(themeConfig),
    isSupported(support) {
      return support.includes(platform);
    },
    r(token: ParsedRule) {
      if (cache.has(token.n)) {
        return cache.get(token.n);
      }
      if (ruleHandlers.length == 0) {
        for (const rule of rules) {
          const handler = new RuleHandler(rule);
          if (ctx.isSupported(handler.support)) {
            ruleHandlers.push(handler);
          }
        }
      }
      for (const current of ruleHandlers) {
        const nextToken = current.resolve(token, ctx);
        if (nextToken) {
          cache.set(token.n, nextToken);
          return nextToken;
        }
      }
      return null;
    },
  };
  return ctx;

  function createThemeFunction<Theme extends BaseTheme = BaseTheme>({
    extend = {},
    ...baseConfig
  }: ThemeConfig<Theme>) {
    return theme as ThemeFunction<Theme>;
    function theme(
      themeSection: keyof typeof baseConfig & keyof typeof extend,
      key?: string,
      defaultValue?: string,
    ) {
      if (!key) {
        let config = baseConfig[themeSection];
        if (typeof config == 'function') config = config(ctx);
        return {
          ...config,
          ...extend[themeSection],
        };
      }
      // console.log('KEY: ', key, themeSection);
      if (key[0] == '[' && key.slice(-1) == ']') {
        return key.slice(1, -1);
      }
      // The utility has an arbitrary value
      if (key.startsWith('[') && key.endsWith(']')) {
        return key.slice(1, -1);
      }
      if (themeSection in baseConfig) {
        let initialValue = baseConfig[themeSection];
        if (typeof initialValue == 'function') initialValue = initialValue(ctx);
        if (themeSection in extend) {
          initialValue = {
            ...initialValue,
            ...extend[themeSection],
          };
        }
        return key.split('-').reduce((prev, current) => {
          if (!current || !prev) return null;
          if (typeof prev == 'object') {
            return prev[current];
          }
          return prev;
        }, initialValue);
      }
      return defaultValue ?? null;
    }
  }
}
