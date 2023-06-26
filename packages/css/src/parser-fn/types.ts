import type { SelectorGroup } from '../types';

export interface AstSheetNode {
  type: 'SHEET';
  value: AstRuleNode;
}

export interface AstRuleNode {
  type: 'RULE';
  selector: AstSelectorNode;
  declarations: AstDeclarationNode[];
}

export interface AstSelectorNode {
  type: 'SELECTOR';
  value: string;
  group: SelectorGroup;
}

export interface AstDeclarationNode {
  type: 'DECLARATION';
  property: string;
  value: AstDeclarationValueNode;
}

export interface AstDimensionsNode {
  type: 'DIMENSIONS';
  value: number;
  units: string;
}

export interface AstRawValueNode {
  type: 'RAW';
  value: string;
}

export interface AstFlexNode {
  type: 'FLEX';
  flexBasis: AstDimensionsNode;
  flexShrink: AstDimensionsNode;
  flexGrow: AstDimensionsNode;
}

export type AstDeclarationValueNode = AstDimensionsNode | AstFlexNode | AstRawValueNode;
