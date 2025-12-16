import vueTsEslintConfig from '@vue/eslint-config-typescript'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginVue from 'eslint-plugin-vue'

export default [
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', 'node_modules/**'],
  },
  ...pluginVue.configs['flat/essential'],
  ...vueTsEslintConfig({
    supportedScriptLangs: {
      ts: true,
      tsx: true,
    },
  }),
  {
    plugins: {
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // 自动移除未使用的 imports
      'unused-imports/no-unused-imports': 'error',
      // import 排序
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      // Vue 规则
      'vue/multi-word-component-names': 'off',
      // TypeScript 规则
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
