import * as vscode from 'vscode';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import {
  NativeTwinManagerService,
  NativeTwinManager,
} from '@native-twin/language-service';
import { launchExtension } from './extension/extension.program.js';
import { VscodeContext } from './extension/extension.service.js';
import { LanguageClientLive, VscodeHightLightsProvider } from './language/index.js';
import { TwinTreeDataFilesProvider } from './tree-data-providers/index.js';
import { ClientCustomLogger } from './utils/logger.service.js';

const MainLive = Layer.mergeAll(LanguageClientLive, TwinTreeDataFilesProvider).pipe(
  Layer.provide(VscodeHightLightsProvider.Live),
  Layer.provide(NativeTwinManagerService.Live(new NativeTwinManager())),
  Layer.provide(ClientCustomLogger),
);

export function activate(context: vscode.ExtensionContext) {
  launchExtension(MainLive).pipe(
    Effect.provideService(VscodeContext, context),

    Effect.runFork,
  );
}
