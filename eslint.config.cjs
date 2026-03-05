const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    files: ['public/assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'off'
    }
  }
];