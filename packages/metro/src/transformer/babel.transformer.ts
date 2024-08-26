import upstreamTransformer from '@expo/metro-config/babel-transformer';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as LogLevel from 'effect/LogLevel';
import * as Logger from 'effect/Logger';
import { BabelLogger, babelTraverseCode } from '@native-twin/babel/jsx-babel';
import { BabelTransformerFn } from '@native-twin/babel/jsx-babel/models';
import {
  BabelTransformerService,
  MetroCompilerContext,
  BabelTransformerServiceLive,
} from '@native-twin/babel/jsx-babel/services';
import { BabelCacheContext } from './babel/babel.cache';

const mainProgram = Effect.gen(function* () {
  const ctx = yield* MetroCompilerContext;
  const transformer = yield* BabelTransformerService;

  if (transformer.isNotAllowedPath(ctx.filename)) return ctx.code;

  const compiled = yield* babelTraverseCode(ctx.code);

  return compiled.generated;
});

const MainLayer = Layer.merge(BabelTransformerServiceLive, BabelCacheContext.Live).pipe(
  Layer.merge(Logger.replace(Logger.defaultLogger, BabelLogger)),
);

export const babelRunnable = Effect.scoped(
  mainProgram.pipe(Logger.withMinimumLogLevel(LogLevel.All), Effect.provide(MainLayer)),
);

export const transform: BabelTransformerFn = async (params) => {
  return babelRunnable.pipe(
    Effect.provide(
      MetroCompilerContext.make(params, {
        componentID: true,
        styledProps: true,
        templateStyles: true,
        tree: true,
        order: true,
      }),
    ),
    Effect.map((code) =>
      // @ts-expect-error
      upstreamTransformer.transform({
        src: code,
        options: params.options,
        filename: params.filename,
      }),
    ),
    Effect.runPromise,
  );
};