import * as Effect from 'effect/Effect';
import * as Option from 'effect/Option';
import * as vscode from 'vscode-languageserver';
import { DocumentsService } from '../../documents';

export const getDocumentHighLightsProgram = (
  params: vscode.DocumentHighlightParams,
  _token: vscode.CancellationToken,
  _workDone: vscode.WorkDoneProgressReporter,
  _resultProgress: vscode.ResultProgressReporter<vscode.DocumentHighlight[]> | undefined,
): Effect.Effect<vscode.DocumentHighlight[], never, DocumentsService> =>
  Effect.gen(function* () {
    const documentsHandler = yield* DocumentsService;
    const document = yield* documentsHandler
      .getDocument(params.textDocument.uri)
      .pipe(Effect.map(Option.getOrNull));

    if (!document) return [];

    const cursorOffset = document.positionToOffset(params.position);
    const highlights: vscode.DocumentHighlight[] = document
      .getTemplateAtPosition(params.position)
      .pipe(
        Option.flatMap((x) => x.getParsedNodeAtOffset(cursorOffset)),
        Option.map((node) => {
          const highLights: vscode.DocumentHighlight[] = [];
          if (node.token.type === 'CLASS_NAME') {
            highLights.push({
              range: vscode.Range.create(
                document.offsetToPosition(node.bodyLoc.start),
                document.offsetToPosition(node.bodyLoc.end),
              ),
              kind: vscode.DocumentHighlightKind.Text,
            });
          }
          return highLights;
        }),
        Option.getOrElse(() => []),
      );

    return highlights;
  });
