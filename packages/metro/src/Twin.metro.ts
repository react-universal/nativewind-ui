import { Config, Option } from 'effect';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as ManagedRuntime from 'effect/ManagedRuntime';
import path from 'node:path';
import { inspect } from 'node:util';
import {
  CompilerConfigContext,
  CompilerConfigContextLive,
  NodeWithNativeTwinOptions,
  TwinFileSystem,
  TwinNodeContext,
  listenForkedStreamChanges,
  twinLoggerLayer,
} from '@native-twin/compiler';
import { TwinMetroConfig } from './models/Metro.models.js';
import { getMetroSettings } from './programs/getMetroSettings.js';

// Layer.provideMerge(TwinFileSystem.Live),

const MainLive = Layer.empty.pipe(
  Layer.provideMerge(TwinNodeContext.Live),
  Layer.provideMerge(CompilerConfigContextLive),
);

const MainLiveAsync = TwinFileSystem.Live.pipe(Layer.provideMerge(MainLive));
export function withNativeTwin(
  metroConfig: TwinMetroConfig,
  nativeTwinConfig: NodeWithNativeTwinOptions,
): TwinMetroConfig {
  // {
  //   logLevel: LogLevel.fromLiteral(nativeTwinConfig.logLevel),
  //   inputCSS: nativeTwinConfig.inputCSS,
  //   outputDir: nativeTwinConfig.outputDir,
  //   projectRoot: nativeTwinConfig.projectRoot,
  //   twinConfigPath: nativeTwinConfig.twinConfigPath,
  // }

  const runtimeSync = ManagedRuntime.make(MainLive);

  const metroSettings = runtimeSync.runSync(
    Effect.flatMap(CompilerConfigContext, (x) =>
      x.setConfigByUser(nativeTwinConfig).pipe(Effect.flatMap(() => getMetroSettings)),
    ),
  );

  const runtimeAsync = ManagedRuntime.make(MainLiveAsync);

  const originalResolver = metroConfig.resolver.resolveRequest;
  const originalGetTransformerOptions = metroConfig.transformer.getTransformOptions;

  // NodeRuntime.runMain(
  //   LaunchTwinServer.pipe(
  //     Effect.catchAll((error) => Effect.log('ERROR: ', error)),
  //     Effect.provide(setConfigLayerFromUser),
  //     Effect.provide(serverEnvLayer),
  //   ),
  // );

  // console.log('PROCESS: ', inspect(process.env, false, null, true));

  // console.log('METRO: ', inspect(metroConfig.resolver, false, null, true));

  runtimeSync.runSync(
    Effect.gen(function* () {
      const ctx = yield* CompilerConfigContext;

      console.log('ENV_CONFIG: ', ctx);
      // console.log('MOD_ENV: ', yield* ctx.env);
    }),
  );

  console.log(
    'TEST: ',
    Effect.runSync(
      Effect.all({
        env: Config.string('PWD'),
      }),
    ),
  );

  return {
    ...metroConfig,
    transformerPath: require.resolve('./programs/metro.transformer'),
    resolver: {
      ...metroConfig.resolver,
      resolveRequest: (context, moduleName, platform) => {
        const resolver = originalResolver ?? context.resolveRequest;
        const resolved = resolver(context, moduleName, platform);
        if (!platform || !Option.isSome(metroSettings.env.inputCSS)) return resolved;

        const platformOutput = metroSettings.ctx.getOutputCSSPath(platform);
        const platformInput = metroSettings.env.inputCSS.value;

        if ('filePath' in resolved && resolved.filePath === platformInput) {
          // console.log('ASDASDASDAD: ', resolved, path.resolve(platformOutput));
          return {
            ...resolved,
            filePath: path.resolve(platformOutput),
          };
        }

        return resolved;
      },
    },
    transformer: {
      ...metroConfig.transformer,
      originalTransformerPath: metroConfig.transformerPath,
      twinConfig: metroSettings.transformerOptions,
      getTransformOptions: (entryPoints, options, getDeps) => {
        return Effect.gen(function* () {
          const result = yield* Effect.promise(() =>
            originalGetTransformerOptions(entryPoints, options, getDeps),
          );

          if (!options.platform) return result;
          const watcher = yield* TwinFileSystem;

          const allFiles = yield* watcher.getAllFiles;
          yield* watcher.runTwinForFiles(allFiles, options.platform);
          yield* Effect.logDebug('CHECK_DEBUG_LOGGER');

          yield* listenForkedStreamChanges(watcher.fsWatcher, (event) => {
            return Effect.logTrace(
              'FILE_CHANGE_DETECTED',
              inspect(event, false, null, true),
            );
          });
          yield* Effect.logTrace(`Watcher started for [${options.platform}]`);

          // yield* TwinFileSystem.metrics.providedFreq.value;

          return result;
        }).pipe(
          Effect.annotateLogs('platform', options.platform),
          Effect.withSpan('Transformer', { attributes: { ...options } }),
          Effect.provide(twinLoggerLayer),
          Effect.scoped,
          runtimeAsync.runPromise,
        );
      },
    },
  };
}

// const serverEnvLayer = Effect.gen(function* () {
//   yield* TwinEnv.modifyEnv(
//     TwinEnv.TWIN_ENV_KEYS.twinConfigPath,
//     nativeTwinConfig.twinConfigPath,
//   );
//   if (nativeTwinConfig.inputCSS) {
//     yield* TwinEnv.modifyEnv(TwinEnv.TWIN_ENV_KEYS.inputCSS, nativeTwinConfig.inputCSS);
//   }
//   if (nativeTwinConfig.projectRoot) {
//     yield* TwinEnv.modifyEnv(
//       TwinEnv.TWIN_ENV_KEYS.projectRoot,
//       nativeTwinConfig.projectRoot,
//     );
//   }

//   if (nativeTwinConfig.outputDir) {
//     yield* TwinEnv.modifyEnv(
//       TwinEnv.TWIN_ENV_KEYS.outputDir,
//       nativeTwinConfig.outputDir,
//     );
//   }

//   return TwinEnv.TwinEnvContextLive;
// }).pipe(Layer.unwrapScoped);
