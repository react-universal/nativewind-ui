import { traceLayerLogs } from '@/utils/logger.utils';
import {
  MonacoNativeTwinManager,
  NativeTwinManagerService,
} from '@native-twin/language-service/browser';
import * as Layer from 'effect/Layer';
import * as Logger from 'effect/Logger';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import { AppWorkersService } from './services/AppWorkers.service';
import { TwinEditorConfigService } from './services/EditorConfig.service';
import { FileSystemService } from './services/FileSystem.service';
import { MonacoContext } from './services/MonacoContext.service';

const loggerLayer = Logger.replace(
  Logger.defaultLogger,
  Logger.prettyLogger({
    colors: true,
    mode: 'browser',
  }),
);

// const baseLayers = Layer.mergeAll(
//   TwinEditorService.Live,
//   NativeTwinManagerService.Live,
//   FileSystemService.Live,
//   TwinEditorConfigService.Live,
// );

export const EditorMainLive = Layer.empty.pipe(
  // Layer.provideMerge(TwinEditorService.Live),
  Layer.provideMerge(AppWorkersService.Live),
  Layer.provideMerge(FileSystemService.Live),
  Layer.provideMerge(TwinEditorConfigService.Live),
  Layer.provideMerge(MonacoContext.Live),
  Layer.provideMerge(
    NativeTwinManagerService.Live(new MonacoNativeTwinManager()).pipe(
      traceLayerLogs('twin manager'),
    ),
  ),
  Layer.provide(loggerLayer),
);

export const EditorMainRuntime = ManagedRuntime.make(EditorMainLive);
