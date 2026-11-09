# React + TypeScript + Vite
## Подключение Supabase
1. Выполните обновлённый `supabase/schema.sql` в SQL Editor. Он добавит поля и функции ежедневных заданий, не сбрасывая ненулевые балансы.
2. В Vercel → **Settings → Environment Variables** задайте `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` и `TELEGRAM_BOT_TOKEN`.
3. Добавьте Telegram-бота администратором канала `@animequiznews`, иначе Telegram не позволит проверять подписчиков.
4. Запустите новый deploy Vercel после добавления переменных.

Ежедневный бонус составляет 50 монет и доступен раз в UTC-день. Награда за подтверждённую подписку — 100 монет один раз на игрока. Секреты `SUPABASE_SERVICE_ROLE_KEY` и `TELEGRAM_BOT_TOKEN` используются только Vercel API и никогда не должны иметь префикс `VITE_`.


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
