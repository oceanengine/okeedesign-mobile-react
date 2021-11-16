module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
    },
    sourceType: 'module',
  },
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single'],
    semi: 'off',
    'react/prop-types': [2, { ignore: ['children'] }],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  overrides: [
    {
      files: ['*.tsx', '*.ts'],
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // https://www.npmjs.com/package/@typescript-eslint/eslint-plugin
        // "plugin:@typescript-eslint/recommended-requiring-type-checking"
        'plugin:react/recommended',
        'plugin:prettier/recommended',
      ],
      plugins: ['@typescript-eslint', 'react', 'react-hooks'],
      rules: {
        '@typescript-eslint/no-explicit-any': 0,
        '@typescript-eslint/ban-ts-ignore': 0,
        'react-hooks/rules-of-hooks': 'error',
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-empty-function': 0,
        'react-hooks/exhaustive-deps': 'warn',
      },
    },
  ],
};
