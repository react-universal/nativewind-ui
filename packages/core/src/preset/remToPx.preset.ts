import type { Preset } from '@twind/core';
import type { RemToPxBaseOptions } from './types';

export default function presetRemToPx({ baseRem = 16 }: RemToPxBaseOptions): Preset {
  return {
    finalize(rule) {
      console.log('RULE: ', rule);
      if (rule.n === 'flex-1') {
        return {
          ...rule,
          d: 'flex: 1',
        };
      }
      return {
        ...rule,
        // d: the CSS declaration body
        // Based on https://github.com/TheDutchCoder/postcss-rem-to-px/blob/main/index.js
        d: rule.d?.replace(/"[^"]+"|'[^']+'|url\([^)]+\)|(-?\d*\.?\d+)rem/g, (match, p1) => {
          if (p1 === undefined) return match;
          return `${p1 * baseRem}${p1 == 0 ? '' : 'px'}`;
        }),
      };
    },
  };
}