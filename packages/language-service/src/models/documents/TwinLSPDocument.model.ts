import * as VSCDocument from 'vscode-languageserver-textdocument';
import type * as t from '@babel/types';
import * as RA from 'effect/Array';
import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import * as Option from 'effect/Option';
import { babelExtractors } from '@native-twin/compiler/babel';
import { NativeTwinPluginConfiguration } from '../../utils/constants.utils';
import { BaseTwinTextDocument } from './BaseTwinDocument';
import { DocumentLanguageRegion } from './LanguageRegion.model';

export class TwinLSPDocument extends BaseTwinTextDocument {
  constructor(
    textDocument: VSCDocument.TextDocument,
    config: NativeTwinPluginConfiguration,
  ) {
    super(textDocument, config);
  }

  getLanguageRegions() {
    const regions = babelExtractors.extractLanguageRegions(
      this.getText(undefined),
      this.config,
    );
    return RA.map(regions, (x) => this.getRegionAt(x));
  }

  findTokenLocationAt(position: VSCDocument.Position) {
    const regions = this.getLanguageRegions();
    const positionOffset = this.offsetAt(position);
    return RA.findFirst(regions, (x) =>
      this.isPositionAtOffset({ end: x.endOffset, start: x.startOffset }, positionOffset),
    );
  }

  getTemplateAtPosition(position: VSCDocument.Position) {
    const positionOffset = this.offsetAt(position);
    return Option.fromNullable(
      this.getLanguageRegions().find(
        (x) => positionOffset >= x.startOffset && positionOffset <= x.endOffset,
      ),
    );
  }

  // MARK: Equality protocol
  [Equal.symbol](that: unknown) {
    return (
      that instanceof TwinLSPDocument &&
      this.version === that.version &&
      this.uri === that.uri
    );
  }

  [Hash.symbol](): number {
    return Hash.combine(Hash.hash(this.uri))(this.version);
  }

  // MARK: Private methods
  private getRegionAt(location: t.SourceLocation) {
    let range = this.babelLocationToRange(location);
    const text = this.getText(range);
    const startOffset = this.offsetAt(range.start);
    const endOffset = this.offsetAt(range.end);
    return new DocumentLanguageRegion(range, startOffset, endOffset, text);
  }
}
