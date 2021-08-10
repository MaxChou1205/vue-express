module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', '@vue/prettier'],
  plugins: ['vue', 'prettier'],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    // compile 會拿掉 console.log
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'vue/no-multiple-template-root': 'off',
    'vue/no-multiple-template-root': 0,
    'no-unused-vars': ['error', { args: 'none' }],
    'vue/no-deprecated-slot-attribute': 'off',
  },
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
};
