import * as Effect from 'effect/Effect';
import { pipe } from 'effect/Function';
import * as HashSet from 'effect/HashSet';
import * as Option from 'effect/Option';
import * as ReadonlyArray from 'effect/ReadonlyArray';
import * as vscode from 'vscode-languageserver-types';
import { CompletionItem } from 'vscode-languageserver/node';
import { FinalSheet } from '@native-twin/css';
import { TwinStore } from '../../native-twin/nativeTwin.service';
import {
  TwinRuleCompletionWithToken,
  TwinRuleWithCompletion,
} from '../../native-twin/nativeTwin.types';
import { TemplateNode } from '../../template/TemplateNode.service';
import {
  CompletionPart,
  getCompletionEntryDetailsDisplayParts,
  getCompletionParts,
  getCompletionTokenKind,
  getDocumentation,
} from './language.utils';

export const createCompletionsWithToken = (
  template: Option.Option<TemplateNode>,
  store: TwinStore,
) => {
  return Effect.sync(() => {
    const positionTokens: CompletionPart[] = Option.map(template, (node) =>
      pipe(
        ReadonlyArray.fromIterable(node.parsedTemplate),
        ReadonlyArray.map((x) => getCompletionParts(x)),
        ReadonlyArray.flatten,
      ),
    ).pipe(Option.getOrElse(() => []));

    return pipe(
      store.twinRules,
      HashSet.flatMap((ruleInfo) => {
        return HashSet.fromIterable(positionTokens).pipe(
          HashSet.filter((x) => {
            if (ruleInfo.completion.className === x.text) {
              return true;
            }
            if (x.type === 'VARIANT_CLASS') {
              return ruleInfo.completion.className.startsWith(x.value[1].value.n);
            }

            return ruleInfo.completion.className.startsWith(x.text);
          }),
          HashSet.map(
            (token): TwinRuleCompletionWithToken => ({
              completion: ruleInfo.completion,
              composition: ruleInfo.composition,
              rule: ruleInfo.rule,
              token,
            }),
          ),
        );
      }),
    );
  });
};

export const filterCompletionByTemplateOffset = (
  tokens: HashSet.HashSet<TwinRuleCompletionWithToken>,
  position: number,
) => HashSet.filter(tokens, (x) => position >= x.token.start && position <= x.token.end);

export const completionRuleToEntry = (
  completionRule: TwinRuleCompletionWithToken,
  // replacementSpan: ts.TextSpan,
  index: number,
): vscode.CompletionItem => {
  const { completion } = completionRule;
  return {
    // symbol: {} as any,
    kind: getCompletionTokenKind(completionRule),
    filterText: completion.className,
    // kindModifiers: getKindModifiers(rule),
    label: completion.className,
    sortText: index.toString().padStart(8, '0'),
    // sourceDisplay: getCompletionEntryDetailsDisplayParts(completionRule),
    detail: getCompletionEntryDetailsDisplayParts(completionRule)?.text,
    labelDetails: {
      description: completion.declarations.join(','),
    },
    // replacementSpan,
    insertText: completion.className,
    // source: completion.className,
    // isRecommended: true,
  };
};

export function createCompletionEntryDetails(
  completion: CompletionItem,
  item: TwinRuleWithCompletion,
  sheetEntry: FinalSheet,
): CompletionItem {
  const documentation = getDocumentation(item, sheetEntry);

  return {
    ...completion,
    documentation: {
      kind: vscode.MarkupKind.Markdown,
      value: documentation,
    },
  };
}

export const completionRulesToEntries = (
  completionRules: HashSet.HashSet<TwinRuleCompletionWithToken>,
) => {
  let i = 0;
  return HashSet.map(completionRules, (rule) => {
    // const documentPosition = node.node.pos + 1;
    // const documentStart = rule.token.start + documentPosition;
    // const documentEnd = rule.token.end + documentPosition;
    // const replacementSpan: vscode.CompletionItem[''] = {
    //   start: node.document.document.offsetAt(
    //     node.templateContext.toPosition(documentStart),
    //   ),
    //   length:
    //     node.templateContext.toOffset(node.templateContext.toPosition(documentEnd)) -
    //     node.templateContext.toOffset(node.templateContext.toPosition(documentStart)),
    // };
    return completionRuleToEntry(rule, i++);
  }).pipe(HashSet.values, (x) => Array.from(x));
};

export function completionRulesToQuickInfo(
  completionRules: HashSet.HashSet<TwinRuleCompletionWithToken>,
  sheetEntry: FinalSheet,
): Option.Option<vscode.Hover> {
  return HashSet.map(completionRules, (rule) => {
    // const documentPosition = node.node.pos + 1;
    // const documentStart = rule.token.start + documentPosition;
    // const documentEnd = rule.token.end + documentPosition;
    // const replacementSpan: ts.TextSpan = {
    //   start: node.templateContext.toOffset(
    //     node.templateContext.toPosition(documentStart),
    //   ),
    //   length:
    //     node.templateContext.toOffset(node.templateContext.toPosition(documentEnd)) -
    //     node.templateContext.toOffset(node.templateContext.toPosition(documentStart)),
    // };
    return completionRuleToQuickInfo(rule, sheetEntry);
  }).pipe(HashSet.values, (x) => ReadonlyArray.fromIterable(x), ReadonlyArray.head);
}

export function completionRuleToQuickInfo(
  item: TwinRuleWithCompletion,
  sheetEntry: FinalSheet,
): vscode.Hover {
  const documentation = getDocumentation(item, sheetEntry);

  return {
    contents: [
      {
        language: vscode.MarkupKind.Markdown,
        value: documentation,
      },
    ],
  };
}