import * as ReadonlyArray from 'effect/Array';
import { pipe } from 'effect/Function';
import * as HashSet from 'effect/HashSet';
import { __Theme__ } from '@native-twin/core';
import {
  TwinRuleWithCompletion,
  TwinVariantCompletion,
} from '../../types/native-twin.types';
import {
  InternalTwFn,
  InternalTwinConfig,
  InternalTwinThemeContext,
  TwinStore,
} from '../native-twin.models';
import { createRuleClassNames, createRuleCompositions } from '../native-twin.rules';

export const createTwinStore = (nativeTwinHandler: {
  tw: InternalTwFn;
  context: InternalTwinThemeContext;
  config: InternalTwinConfig;
}): TwinStore => {
  const theme = { ...nativeTwinHandler.tw.config.theme };
  const themeSections = new Set(Object.keys({ ...theme, ...theme.extend }).sort());
  // const twinRules = HashSet.empty<TwinRuleWithCompletion>();
  themeSections.delete('theme');
  themeSections.delete('extend');
  let currentIndex = 0;
  // let position = 0;
  const currentConfig = nativeTwinHandler.config;
  const variants = Object.entries({
    ...currentConfig.theme.screens,
    ...currentConfig.theme.extend?.screens,
  });
  const colorPalette = {
    ...nativeTwinHandler.context.colors,
    ...nativeTwinHandler.config.theme.extend?.colors,
  };

  const twinVariants = HashSet.fromIterable(variants).pipe(
    HashSet.map((variant): TwinVariantCompletion => {
      return {
        kind: 'variant',
        name: `${variant[0]}:`,
        index: currentIndex++,
        position: currentIndex,
      } as const;
    }),
  );

  const twinThemeRules = ReadonlyArray.fromIterable(nativeTwinHandler.tw.config.rules);

  const flattenRules = ReadonlyArray.flatMap(twinThemeRules, (rule) => {
    return createRuleCompositions(rule).flatMap((composition) => {
      const values =
        composition.parts.themeSection === 'colors'
          ? colorPalette
          : nativeTwinHandler.context.theme(
              composition.parts.themeSection as keyof __Theme__,
            ) ?? {};
      return createRuleClassNames(values, composition.composition, composition.parts).map(
        (className): TwinRuleWithCompletion => ({
          kind: 'rule',
          completion: className,
          composition: composition.composition,
          rule: composition.parts,
          order: currentIndex++,
        }),
      );
    });
  });

  const composedTwinRules: HashSet.HashSet<TwinRuleWithCompletion> = pipe(
    flattenRules,
    // ReadonlyArray.fromIterable(nativeTwinHandler.tw.config.rules),
    // ReadonlyArray.map((x) => createRuleCompositions(x)),
    // ReadonlyArray.flatten,
    // ReadonlyArray.map((x) => {
    //   const values =
    //     x.parts.themeSection === 'colors'
    //       ? colorPalette
    //       : nativeTwinHandler.context.theme(x.parts.themeSection as keyof __Theme__) ??
    //         {};
    //   return createRuleClassNames(values, x.composition, x.parts).map(
    //     (className): TwinRuleWithCompletion => ({
    //       completion: className,
    //       composition: x.composition,
    //       rule: x.parts,
    //     }),
    //   );
    // }),
    // ReadonlyArray.flatten,
    ReadonlyArray.sortBy((x, y) => (x.order > y.order ? 1 : -1)),
    HashSet.fromIterable,
  );

  return {
    twinRules: composedTwinRules,
    twinVariants,
  };
};
