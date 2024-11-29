module.exports = {
  extends: '../../eslintrc.config.js',
  ignorePatterns: [
    '!**/*',
    'ts-extension',
    'project-fixture',
    '.vscode-test.mjs',
    '.vscode-test',
    'esbuild.mjs',
    'build',
  ],
  overrides: [
    {
      files: ['*.ts'],
      extends: ['plugin:@nx/typescript'],
      rules: {
        'no-case-declarations': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        '@typescript-eslint/no-empty-object-type': 'off',
        'require-yield': 'off',
        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            argsIgnorePattern: '^_',
          },
        ],
      },
    },
  ],
};