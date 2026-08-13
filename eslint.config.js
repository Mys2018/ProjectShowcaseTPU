import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import fsdPlugin from 'eslint-plugin-fsd-lint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist/**/*.ts', 'dist/**', 'eslint.config.js', '**/*.js']),
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.browser }
  },
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
        projectService: true
      }
    },
    rules: {
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/prefer-promise-reject-errors': 'off'
    },
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat['jsx-runtime'],
  fsdPlugin.configs.strict
])
