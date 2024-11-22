import CodeBlockWriter from 'code-block-writer';
import * as Effect from 'effect/Effect';
import * as Layer from 'effect/Layer';
import * as LogLevel from 'effect/LogLevel';
import * as Logger from 'effect/Logger';
import type { TransformResponse } from 'metro-transform-worker';
import path from 'node:path';
import { matchCss } from '@native-twin/helpers/server';
import { assertString } from '../../../shared';
import { BabelCompiler, makeBabelConfig } from '../../babel';
import { compileReactCode } from '../../babel/programs/react.program';
import { TwinNodeContext } from '../../services/TwinNodeContext.service';
import { makeNodeLayer } from '../../services/node.make';
import type { TwinMetroTransformFn } from '../models';
import { makeWorkerLayers, MetroWorkerService } from '../services/MetroWorker.service';
import { transformCSSExpo } from '../utils/css.utils';

const metroMainProgram = Effect.gen(function* () {
  const { runWorker, input } = yield* MetroWorkerService;
  const twin = yield* TwinNodeContext;
  const babel = yield* BabelCompiler;

  const platformOutput = input.config.outputCSS;
  if (
    matchCss(input.filename) &&
    input.filename.includes(path.basename(platformOutput))
  ) {
    console.log('[METRO_TRANSFORMER]: Detect css file', input.filename);
    const result: TransformResponse = yield* Effect.promise(() =>
      transformCSSExpo(
        input.config,
        input.projectRoot,
        input.filename,
        input.data,
        input.options,
      ),
    );
    return result;
    // return yield* runWorker(input);
  }
  // if (input.filename.match(/\.css\..+?\.js$/)) {
  //   console.log('[METRO_TRANSFORMER]: Inside generated style file');
  //   const writer = new CodeBlockWriter();

  //   const twinConfigPath = input.config.twinConfigPath;
  //   const importTwinPath = path.relative(
  //     path.dirname(twin.getPlatformOutput(twin.platform)),
  //     twinConfigPath,
  //   );
  //   writer.write(`const StyleSheet = require('@native-twin/jsx').StyleSheet;`);
  //   writer.writeLine(`const setup = require('@native-twin/core').setup;`);
  //   writer.writeLine(`const twinConfig = require('${importTwinPath}');`);
  //   writer.newLine();

  //   writer.writeLine(`setup(twinConfig);`);
  //   writer.writeLine(
  //     `console.log(\`Style Fast Refresh: \${Date.now()-${Date.now()}}ms\`)`,
  //   );

  //   writer.writeLine('// Replace_Me');
  //   const result = yield* runWorker({
  //     ...input,
  //     data: Buffer.from(writer.toString()),
  //   });

  //   const response: TransformResponse = {
  //     dependencies: result.dependencies,
  //     output: [
  //       {
  //         // data: result.output[0].data,
  //         data: {
  //           ...(result.output as any)[0].data,
  //           code: (result.output as any)[0].data.code.replace(
  //             '// Replace_Me',
  //             input.data.toString('utf-8'),
  //           ),
  //         },
  //         type: (result.output as any)[0].type,
  //       },
  //     ],
  //   };
  //   return response;
  // }

  if (!twin.utils.isAllowedPath(input.filename)) {
    // transformCSSExpo(input.config, input.projectRoot, input.filename, input.data);
    return yield* runWorker(input);
  }

  // {
  //   code: babelInput.code,
  //   filename: input.filename,
  //   inputCSS: twin.getPlatformInput(),
  //   outputCSS: twin.getPlatformOutput(babelInput.platform),
  //   platform: babelInput.platform,
  //   projectRoot: input.projectRoot,
  //   twinConfigPath: twin.twinConfigPath,
  // }
  const compiled = yield* compileReactCode.pipe(
    Effect.flatMap((x) => babel.buildFile(x.ast)),
  );

  if (!compiled) return yield* runWorker(input);

  const writer = new CodeBlockWriter();

  writer.writeLine('import { tw as runtimeTW } from "@native-twin/core";');
  writer.writeLine(compiled);

  const result = yield* runWorker({
    ...input,
    data: Buffer.from(writer.toString()),
  });

  return result;
}).pipe(Effect.scoped);

export const metroRunnable = Effect.scoped(
  metroMainProgram.pipe(Logger.withMinimumLogLevel(LogLevel.All)),
);

export const transform: TwinMetroTransformFn = async (
  config,
  projectRoot,
  filename,
  data,
  options,
) => {
  const platform = options.platform ?? 'native';
  const outputCSS = config.platformOutputs.find((x) =>
    x.includes(`${options.platform ?? 'native'}.`),
  );

  assertString(outputCSS);

  const babelConfigLayer = makeBabelConfig({
    code: data.toString(),
    filename: filename,
    inputCSS: config.inputCSS,
    outputCSS: outputCSS,
    platform: platform,
    projectRoot: projectRoot,
    twinConfigPath: config.twinConfigPath,
  });
  const nodeLayer = makeNodeLayer({
    configPath: config.twinConfigPath,
    debug: true,
    inputCSS: config.inputCSS,
  });

  const layer = makeWorkerLayers(config, projectRoot, filename, data, options).pipe(
    Layer.provideMerge(nodeLayer.MainLayer),
    Layer.provideMerge(babelConfigLayer),
  );

  return metroRunnable.pipe(Effect.provide(layer), Effect.runPromise);
};
