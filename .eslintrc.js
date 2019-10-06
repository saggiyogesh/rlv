module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'airbnb-typescript',
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
  ],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react-native/no-inline-styles': 'error',
    'no-use-before-define': 'off',
    'operator-assignment': 'off',
    'no-console': 'off',
    'no-unused-vars': 'error',
    'import/prefer-default-export': 'off',
    'no-use-before-define': 'off',
    'global-require': 'off',
    'no-await-in-loop': 'warn',
    'no-param-reassign': 'warn',
    'no-underscore-dangle': 'off',
    'no-empty': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'no-plusplus': 'off',
    '@typescript-eslint/camelcase': 'warn',
    radix: 'warn',
    'import/no-unresolved': 'warn',
    '@typescript-eslint/no-use-before-define': 'off'
  },
};
