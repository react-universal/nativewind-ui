import { describe, expect, it } from 'vitest';
import { setup } from '../src';
import { reactNativeTailwindPreset } from '../src/tailwind/preset/tailwind-preset';

const tw = setup({ content: ['__'], presets: [reactNativeTailwindPreset()] });

describe('TailwindCSS compiler', () => {
  it('Normal color', () => {
    const css = tw('bg-black');
    expect(css).toStrictEqual({
      '.bg-black': {
        backgroundColor: '#000',
      },
    });
  });

  it('Color with opacity', () => {
    const css = tw('bg-black/50');
    expect(css).toStrictEqual({
      '.bg-black\\/50': {
        backgroundColor: 'rgba(0,0,0,0.5)',
      },
    });
  });

  it('Translations', () => {
    const css = tw('translate-x-8');
    expect(css).toStrictEqual({
      '.translate-x-8': {
        transform: 'translate(32px)',
      },
    });
  });
});
