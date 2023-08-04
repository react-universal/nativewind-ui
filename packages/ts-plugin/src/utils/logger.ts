import ts from 'typescript/lib/tsserverlibrary';
import { pluginName } from '../constants/config.constants';

export function createLogFunction(info: ts.server.PluginCreateInfo) {
  return (...stuff: unknown[]) => {
    const output = stuff.map((value) => JSON.stringify(value, null, 2)).join(' ');

    return info.project.projectService.logger.info(`[${pluginName}] ${output}`);
  };
}