// @ts-ignore
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init, miniApp, themeParams, viewport } from '@telegram-apps/sdk-react';

// Проверяем, есть ли в window объект Telegram
const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData !== undefined && window.Telegram.WebApp.initData !== '';

async function initTelegram() {
  if (!isTelegram) {
    console.log("Игра запущена в браузере. Инициализация Telegram пропущена.");
    return;
  }

  try {
    // В v3 init() лучше вызывать после того, как убедились, что мы в ТГ
    init();
    
    // Вместо mount используем mount.ifAvailable(), чтобы не было ошибок, если метод недоступен
    if (miniApp.mount.isAvailable()) {
      await miniApp.mount();
    }
    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
      themeParams.bindCssVars.ifAvailable();
    }
    if (viewport.mount.isAvailable()) {
      await viewport.mount();
      viewport.expand.ifAvailable();
    }
  } catch (error) {
    console.error("Ошибка при инициализации Telegram SDK:", error);
  }
}

initTelegram();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)