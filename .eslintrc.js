module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'plugin:prettier/recommended', 'prettier/react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  parser: 'babel-eslint',
  plugins: ['react', 'prettier'],
  globals: { React: true },
  rules: {
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': 0,
    'react/react-in-jsx-scope': 0,
    'no-tabs': 0,
    semi: [2, 'never'],
    'react/prop-types': 0,
    'react/destructuring-assignment': [
      2,
      'always',
      { ignoreClassFields: true },
    ],
  },
}
