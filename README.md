# React + TypeScript + Vite
## Подключение Supabase

1. В настройках Supabase включите анонимный вход: **Authentication → Sign In / Providers → Anonymous Sign-Ins**.
2. Откройте **SQL Editor**, выполните содержимое `supabase/schema.sql`.
3. Скопируйте `.env.example` в `.env.local` и укажите URL проекта и publishable/anon key из **Project Settings → API**.
4. Перезапустите `npm run dev` после создания `.env.local`.

Таблица профилей закрыта RLS-политиками: игрок может читать и создавать только собственную запись. Начисление за раунд выполняется SQL-функцией.


This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend enabling type-aware lint rules by installing `oxlint-tsgolint` and editing `.oxlintrc.json`:

```json
{
  "$schema": "./node_modules/oxlint/configuration_schema.json",
  "plugins": ["react", "typescript", "oxc"],
  "options": {
    "typeAware": true
  },
  "rules": {
    "react/rules-of-hooks": "error",
    "react/only-export-components": ["warn", { "allowConstantExport": true }]
  }
}
```

See the [Oxlint rules documentation](https://oxc.rs/docs/guide/usage/linter/rules) for the full list of rules and categories.
