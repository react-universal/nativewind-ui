import { type TailwindConfig, type TailwindUserConfig, install } from '@native-twin/core';
import { type SheetEntry, sheetEntriesToCss } from '@native-twin/css';
import { getNonce } from '@native-twin/helpers';
import { useServerInsertedHTML } from 'next/navigation.js';
import React, { type ReactNode, useState } from 'react';
import { StyleSheet } from 'react-native';
interface AppComponentProps {
  children: ReactNode;
}
export const NativeTwinSheet = (twinConfig: TailwindUserConfig | TailwindConfig) => {
  const AppComponent = ({ children }: AppComponentProps) => {
    const [twin] = useState(() => {
      let config = twinConfig as TailwindUserConfig;
      if (twinConfig.mode !== 'web') {
        config = Object.assign({ mode: 'web' }, twinConfig) as TailwindUserConfig;
      }
      return install(config, !__DEV__);
    });
    useServerInsertedHTML(() => {
      // @ts-expect-error asd
      const rnSheet = StyleSheet.getSheet();
      return (
        <>
          <style
            // @ts-expect-error asd
            nonce={getNonce()}
            dangerouslySetInnerHTML={{
              __html: rnSheet.textContent,
            }}
          />
          <style
            data-native-twin=''
            // @ts-expect-error asd
            nonce={getNonce()}
            dangerouslySetInnerHTML={{
              __html: sheetEntriesToCss((twin.target ?? []) as SheetEntry[]),
            }}
          />
        </>
      );
    });
    return <>{children}</>;
  };

  return AppComponent;
};
