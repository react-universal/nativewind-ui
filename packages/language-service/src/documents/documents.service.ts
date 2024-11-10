import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as Option from 'effect/Option';
import * as Stream from 'effect/Stream';
import type { Connection, TextDocuments } from 'vscode-languageserver';
import type { TextDocument } from 'vscode-languageserver-textdocument';
import { LSPConfigService } from '../config';
import { TwinLSPDocument } from './models/twin-document.model';

export interface DocumentsServiceShape {
  handler: TextDocuments<TextDocument>;
  getDocument: (uri: string) => Option.Option<TwinLSPDocument>;
  setupConnection(connection: Connection): void;
}

const setupConnection =
  (handler: TextDocuments<TextDocument>) => (connection: Connection) =>
    handler.listen(connection);

const make = (handler: TextDocuments<TextDocument>) =>
  Effect.gen(function* () {
    const config = yield* LSPConfigService;

    yield* config.changes.pipe(
      Stream.runForEach((x) => {
        return Effect.log('dsfsdf', x);
      }),
      Effect.fork,
    );

    const acquireDocument = (uri: string) =>
      Effect.gen(function* () {
        const currentConfig = yield* config.get;
        return Option.map(
          Option.fromNullable(handler.get(uri)),
          (x) => new TwinLSPDocument(x, currentConfig.vscode),
        );
      });

    return {
      handler,
      getDocument: acquireDocument,
      setupConnection: setupConnection(handler),
    };
  });

const createDocumentsLayer = (handler: TextDocuments<TextDocument>) => {
  return Layer.scoped(DocumentsService, make(handler));
};

export class DocumentsService extends Context.Tag('language-service/documents')<
  DocumentsService,
  Effect.Effect.Success<ReturnType<typeof make>>
>() {
  static make = createDocumentsLayer;
}
