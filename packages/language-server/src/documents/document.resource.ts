import * as Equal from 'effect/Equal';
import * as Hash from 'effect/Hash';
import * as Option from 'effect/Option';
import ts from 'typescript';
import * as VSCDocument from 'vscode-languageserver-textdocument';
import * as vscode from 'vscode-languageserver/node';
import { parseTemplate } from '../native-twin/native-twin.parser';
import { TemplateTokenWithText } from '../template/template.models';
import { NativeTwinPluginConfiguration } from '../types/extension.types';
import { Matcher } from '../utils/match';
import { getAllDocumentTemplates, getTemplateLiteralNode } from './utils/document.utils';

export class TwinDocument implements Equal.Equal {
  readonly handler: VSCDocument.TextDocument;
  readonly sourceMatchers: Matcher[];
  readonly config: NativeTwinPluginConfiguration;

  constructor(
    document: VSCDocument.TextDocument,
    matcher: Matcher[],
    config: NativeTwinPluginConfiguration,
  ) {
    this.handler = document;
    this.sourceMatchers = matcher;
    this.config = config;
  }

  /** Gets the `typescript` AST */
  get getDocumentSource() {
    return ts.createSourceFile(
      this.handler.uri,
      this.handler.getText(),
      ts.ScriptTarget.Latest,
      /*setParentNodes*/ true,
    );
  }

  getRelativeOffset(template: TemplateNode, position: vscode.Position) {
    return this.handler.offsetAt({
      line: template.range.start.line,
      character: position.character - template.range.start.character,
    });
  }

  getRangeAtPosition(
    part: Pick<TemplateTokenWithText, 'loc' | 'text'>,
    templateRange: vscode.Range,
  ) {
    const realStart = this.handler.positionAt(
      part.loc.start + templateRange.start.character,
    );
    const realEnd = {
      ...realStart,
      character: realStart.character + part.text.length,
    };
    return vscode.Range.create(realStart, realEnd);
  }

  /** Gets the template literal at this position */
  getTemplateNodeAtPosition(position: vscode.Position): Option.Option<TemplateNode> {
    const cursorOffset = this.handler.offsetAt(position);

    const source = this.getDocumentSource;
    const template = getTemplateLiteralNode(source, cursorOffset, this.sourceMatchers);

    const templateRange = template.pipe(
      Option.map((x) => {
        const templateStart = x.getStart() + 1;
        const templateEnd = x.getEnd() - 1;
        return vscode.Range.create(
          this.handler.positionAt(templateStart),
          this.handler.positionAt(templateEnd),
        );
      }),
    );

    return Option.zipWith(template, templateRange, (node, range) => {
      return new TemplateNode(this, node, range);
    });
  }

  getAllTemplates() {
    const source = this.getDocumentSource;
    return getAllDocumentTemplates(source, this.sourceMatchers).map((x) => {
      const position = this.handler.positionAt(x.getStart());
      return this.getTemplateNodeAtPosition(position);
    });
  }

  [Equal.symbol](that: unknown) {
    return (
      that instanceof TwinDocument && that.handler.getText() === this.handler.getText()
    );
  }

  [Hash.symbol](): number {
    return Hash.hash(this.handler.getText());
  }
}

export class TemplateNode implements Equal.Equal {
  constructor(
    readonly handler: TwinDocument,
    readonly node:
      | ts.TemplateLiteral
      | ts.StringLiteralLike
      | ts.NoSubstitutionTemplateLiteral,
    readonly range: vscode.Range,
  ) {}

  get parsedNode() {
    const text = this.node.getText().slice(1, -1);
    const offset = this.handler.handler.offsetAt(this.range.start);
    const parsed = parseTemplate(text, offset);
    return parsed;
  }

  [Equal.symbol](that: unknown) {
    return that instanceof TemplateNode && that.range === this.range;
  }

  [Hash.symbol](): number {
    return Hash.hash(
      `${this.range.end.character}-${this.range.start.character}-${this.node.getFullText()}`,
    );
  }
}
