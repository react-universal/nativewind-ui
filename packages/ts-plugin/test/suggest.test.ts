import { ConfigurationManager } from '../old/language-service/configuration';
import { NativeTailwindIntellisense } from '../old/language-service/intellisense.service';
import { LanguageServiceLogger } from '../old/language-service/logger';

const config = new ConfigurationManager();
// @ts-expect-error
const logger: LanguageServiceLogger = {
  log: () => void {},
};
const intellisense = new NativeTailwindIntellisense(logger, config);
describe('TS PLUGIN', () => {
  it('Complete suggestion list', () => {
    expect(intellisense.completions().classes.size).toStrictEqual(5530);
  });
  it('Enumerate completions', () => {
    // const utility = intellisense.completions().classes.get('border-blue');
    // if (utility) {
    //   console.log('UTIL: ', createCompletionEntryDetails(utility, intellisense.tw));
    // }
    expect(Array.from(intellisense.completions().classes, ([name]) => name)).toMatchSnapshot(
      'Completions Snapshot',
    );
  });
});
