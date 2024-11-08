import * as RA from 'effect/Array';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as vscode from 'vscode';
import {
  getCompletionsForTokens,
  parseTemplate,
  ConfigManagerService,
  NativeTwinManagerService,
  TemplateTokenWithText,
} from '@native-twin/language-service';
import { completionRulesToVscodeCompletionItems } from '../mappers/completion.mappers';
import { TwinTextDocument } from '../models/TwinTextDocument.model';

const getParsedNodeAtOffset = (nodes: TemplateTokenWithText[], offset: number) => {
  return RA.findFirst(nodes, (x) => offset >= x.bodyLoc.start && offset <= x.bodyLoc.end);
};

export class VscodeCompletionsProvider extends Context.Tag(
  'vscode/client/VscodeCompletionsProvider',
)<VscodeCompletionsProvider, vscode.CompletionItemProvider>() {
  static Live = Layer.effect(
    VscodeCompletionsProvider,
    Effect.gen(function* () {
      const config = yield* ConfigManagerService;
      const twin = yield* NativeTwinManagerService;

      return {
        async provideCompletionItems(document, position, _token, _context) {
          const twinDocument = new TwinTextDocument(document);
          const cursorOffset = twinDocument.document.offsetAt(position);
          const foundToken = twinDocument.findTokenLocationAt(position, config.config);

          const completions: vscode.CompletionItem[] = pipe(
            Option.map(foundToken, (x) => {
              return parseTemplate(x.text, x.offset.start);
            }),
            Option.flatMap((tokens) => getParsedNodeAtOffset(tokens, cursorOffset)),
            Option.map((parsedNode) => {
              const tokens = getCompletionsForTokens(parsedNode.flattenToken, twin);
              return completionRulesToVscodeCompletionItems(
                parsedNode.flattenToken,
                tokens,
                twinDocument,
              );
            }),
            Option.getOrElse(() => []),
          );

          return Promise.resolve({
            items: completions,
            isIncomplete: true,
          });
        },
      };
    }),
  );
}