import type { IComponentInteractions } from '../types/store.types';
import type { IStyleType } from '../types/styles.types';
import { parseClassNames, parsePseudoElements } from '../utils/components.utils';
import { createHash } from '../utils/createHash';
import { transformClassNames } from '../utils/styles.utils';
import { createStore } from './generator';

type IStyleCache = {
  normalStyles: IStyleType;
  interactionStyles: IComponentInteractions[];
};
const initialState = {
  stylesCollection: new Map<string, IStyleType>(),
  classNamesCollection: new Map<number, IStyleCache>(),
};

const stylesStore = createStore(initialState);

function prepareStylesStore(classNames: string) {
  const classNamesHash = createHash(classNames);
  const cache = getClassNameCollectionRegister(classNamesHash);
  if (cache) {
    return {
      subscribe: stylesStore.subscribe,
      getSnapshot: () => Object.freeze(cache),
    };
  }
  const { interactionClassNames, normalClassNames } = parseClassNames(classNames);
  const normalStyles: IStyleType = getStylesForClasses(normalClassNames);
  const interactionStyles = getStylesForInteractionClasses(interactionClassNames);
  return {
    subscribe: stylesStore.subscribe,
    getSnapshot: () =>
      Object.freeze({
        normalStyles,
        interactionStyles,
      }),
  };
}

function getStylesForClassNames(classNames: string) {
  const classNamesHash = createHash(classNames);
  const cache = getClassNameCollectionRegister(classNamesHash);
  if (cache) return cache;
  const { interactionClassNames, normalClassNames } = parseClassNames(classNames);
  const normalStyles: IStyleType = getStylesForClasses(normalClassNames);
  const interactionStyles = getStylesForInteractionClasses(interactionClassNames);
  return {
    normalStyles,
    interactionStyles,
  };
}

function getStylesForClasses(className: string[]) {
  const styles = {};
  for (const current in className) {
    const cache = stylesStore.getState().stylesCollection.get(current);
    if (cache) {
      Object.assign(styles, cache);
      continue;
    }
    const style = transformClassNames(current);
    stylesStore.getState().stylesCollection.set(current, style);
    Object.assign(style);
  }
  return styles;
}

function getStylesForInteractionClasses(classNames: string[][]) {
  let interactionStyles: IComponentInteractions[] = [];
  const interactionsClasses = parsePseudoElements(classNames);
  for (const node of interactionsClasses) {
    const interactionType = node[0];
    const interactionClassNames = node[1];
    const compiled = getStylesForClasses([interactionClassNames]);
    interactionStyles.push([
      interactionType,
      {
        classNames: interactionClassNames,
        styles: compiled,
      },
    ]);
  }
  return interactionStyles;
}

function getClassNameCollectionRegister(classNamesHash: number) {
  const classNamesCache = stylesStore.getState().classNamesCollection.get(classNamesHash);
  if (classNamesCache) {
    return classNamesCache;
  }
  return null;
}

function registerClassName(classNamesHash: number, styles: IStyleCache) {
  const classNamesCache = stylesStore
    .getState()
    .classNamesCollection.set(classNamesHash, styles);
  if (classNamesCache) {
    return classNamesCache;
  }
  return null;
}

const useStylesStore = stylesStore.useStore;

export {
  getStylesForClassNames,
  stylesStore,
  useStylesStore,
  registerClassName,
  prepareStylesStore,
};

export type ITailwindStore = ReturnType<(typeof stylesStore)['getState']>;