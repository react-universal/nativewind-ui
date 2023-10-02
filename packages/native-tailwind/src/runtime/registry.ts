import type { ParsedRule } from '@universal-labs/css';
import type { RuleResult, ThemeContext } from '../types/config.types';
import type { SheetEntry } from '../types/css.types';
import type { __Theme__ } from '../types/theme.types';
import type { Falsey } from '../types/util.types';

const registry = new Map<string, RegisterCallback>();

export type RegisterCallback = (
  rule: ParsedRule,
  context: ThemeContext,
) => Falsey | SheetEntry[];

export function register(className: string, factory: RegisterCallback): string {
  registry.set(className, factory);
  return className;
}

export function resolve<Theme extends __Theme__ = __Theme__>(
  rule: ParsedRule,
  context: ThemeContext<Theme>,
): RuleResult | SheetEntry[] {
  const factory = registry.get(rule.n);

  return factory ? factory(rule, context as any) : context.r(rule);
}