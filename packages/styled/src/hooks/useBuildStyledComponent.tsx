import { useMemo } from 'react';
import { StyleSheet, Touchable } from 'react-native';
import {
  useComponentStyleSheets,
  StyledProps,
  createComponentID,
  AnyStyle,
} from '@universal-labs/stylesheets';
import { useComponentInteractions } from './useComponentInteractions';

function useBuildStyledComponent<T>({
  className,
  isFirstChild,
  isLastChild,
  nthChild,
  groupID,
  parentID,
  style,
  tw,
  ...restProps
}: StyledProps<T>) {
  const componentID = useMemo(() => createComponentID() as string, []);
  const currentGroupID = useMemo(() => {
    return groupID ? groupID : parentID ?? 'non-group';
  }, [parentID, groupID]);
  const { stylesheet, component } = useComponentStyleSheets({
    groupID,
    className: className ?? tw,
    inlineStyles: style,
    isFirstChild,
    isLastChild,
    nthChild,
    parentID,
    currentGroupID,
    componentID,
  });

  const { componentInteractionHandlers, focusHandlers } = useComponentInteractions({
    props: restProps as Touchable,
    hasGroupInteractions: stylesheet.metadata.hasGroupEvents,
    hasPointerInteractions: stylesheet.metadata.hasPointerEvents,
    isGroupParent: stylesheet.metadata.isGroupParent,
    id: componentID,
  });

  const componentStyles = useMemo(() => {
    const sheet = stylesheet.getStyles();
    const styles: AnyStyle[] = [sheet.base];
    if (
      component.interactionsState.active ||
      component.interactionsState.focus ||
      component.interactionsState.hover
    ) {
      styles.push(sheet.pointerStyles);
    }
    if (
      component.interactionsState['group-active'] ||
      component.interactionsState['group-focus'] ||
      component.interactionsState['group-hover']
    ) {
      styles.push(sheet.group);
    }
    return StyleSheet.flatten([style, styles]);
  }, [component.interactionsState, stylesheet, style]);

  return {
    componentInteractionHandlers,
    focusHandlers,
    componentStyles,
  };
}

export { useBuildStyledComponent };
