import { Plugin, PluginContext } from '@express-tool/core';

export const eslintConfigTs = `import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  }
);
`;

export const eslintConfigJs = `import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['dist', 'node_modules'],
  },
  js.configs.recommended,
  prettier,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  }
];
`;

export const prettierConfig = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
};

export const qualityPlugin: Plugin = {
  name: 'quality',
  apply: async (context: PluginContext) => {
    const { isTs } = context;

    return {
      devDependencies: {
        husky: '^9.1.7',
        'lint-staged': '^16.2.7',
        prettier: '^3.8.1',
        eslint: '^10.0.0',
        'eslint-config-prettier': '^10.1.8',
        globals: '^15.14.0',
        '@eslint/js': '^9.18.0',
        ...(isTs
          ? {
              'typescript-eslint': '^8.19.1',
            }
          : {}),
      },
      scripts: {
        lint: 'eslint .',
        format: 'prettier --write .',
        prepare: 'husky',
      },
      files: [
        {
          path: '../eslint.config.mjs',
          content: isTs ? eslintConfigTs : eslintConfigJs,
        },
        {
          path: '../.prettierrc',
          content: JSON.stringify(prettierConfig, null, 2),
        },
        {
          path: '../.lintstagedrc.json',
          content: JSON.stringify(
            {
              '**/*.{ts,js,json,md}': ['prettier --write', 'eslint --fix'],
            },
            null,
            2,
          ),
        },
      ],
    } as import('@express-tool/core').PluginAction;
  },
};
