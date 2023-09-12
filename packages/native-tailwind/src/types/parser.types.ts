export interface VariantToken {
  type: 'VARIANT';
  value: {
    i: boolean;
    n: string;
  }[];
}
export interface ColorModifierToken {
  type: 'COLOR_MODIFIER';
  value: string;
}
export interface ClassNameToken {
  type: 'CLASS_NAME';
  value: {
    i: boolean;
    n: string;
    m: ColorModifierToken | null;
  };
}
export interface VariantClassToken {
  type: 'VARIANT_CLASS';
  value: [VariantToken, ClassNameToken];
}
export interface ArbitraryToken {
  type: 'ARBITRARY';
  value: string;
}
export interface GroupToken {
  type: 'GROUP';
  value: {
    base: ClassNameToken | VariantToken;
    content: (ClassNameToken | GroupToken | VariantClassToken | ArbitraryToken)[];
  };
}

export interface ParsedRule {
  /**
   * The utility name including `-` if set, but without `!` and variants
   */
  readonly n: string;

  /**
   * All variants without trailing colon: `hover`, `focus:`
   */
  readonly v: string[];

  /**
   * Has the util an important `!` symbol
   */
  readonly i: boolean;

  /**
   * Has the util a color modifier `bg-red-200/10` or `bg-red-200/[0.5]` symbol
   */
  readonly m: ColorModifierToken | null;
}

export interface RulePatternToken {
  base: string;
  negative: boolean;
}
