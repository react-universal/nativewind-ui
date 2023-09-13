import { Platform } from 'react-native';
import { hash } from '@twind/core';
import { MainSheet } from '@universal-labs/css';
import { Tailwind } from '@universal-labs/twind-adapter';
import type { Config } from 'tailwindcss';
import type { StyledContext } from '../types/css.types';
import { globalStore } from './store';

let twind = new Tailwind();

const createVirtualSheet = () => {
  const processor = Object.assign(
    function (classNames: string) {
      const generated = twind.parseAndInject(classNames);
      return generated;
    },
    {
      hash,
    },
  );
  const globalSheet = new MainSheet(processor);
  return (classNames: string, context: StyledContext) => {
    return globalSheet.parse(classNames, {
      colorScheme: context.colorScheme,
      debug: false,
      deviceHeight: context.deviceHeight,
      deviceWidth: context.deviceWidth,
      platform: Platform.OS,
      rem: context.units.rem,
    });
  };
};

export const virtualSheet = createVirtualSheet();

interface ModuleConfig {
  rem: number;
  theme: Config['theme'];
}

export function install({ rem, theme }: ModuleConfig = { rem: 16, theme: {} }) {
  globalStore.setState((prev) => ({
    ...prev,
    context: {
      ...prev.context,
      units: {
        ...prev.context.units,
        em: rem,
        rem: rem,
      },
    },
  }));
  twind = new Tailwind({
    colors: {
      ...theme?.colors,
    },
    fontFamily: {
      ...theme?.fontFamily,
    },
  });
}
