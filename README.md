# React + TypeScript + Vite
## Подключение Supabase
1. Выполните `supabase/schema.sql` в SQL Editor. Таблица использует Telegram ID типа `bigint`.
2. Скопируйте `.env.example` в `.env.local`, добавьте URL проекта и publishable/anon key.
3. В Vercel добавьте те же `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY` в **Settings → Environment Variables** и запустите redeploy.

Политики из этой схемы открывают чтение и изменение профилей всем посетителям. Для публичной игры их нельзя считать защитой: авторитетное начисление монет требует серверной проверки Telegram `initData`.


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
