module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    '@react-native-community',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['off'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'react/react-in-jsx-scope': 'off',
      },
    },
  ],
};
