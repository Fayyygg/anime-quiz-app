import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { init, miniApp, themeParams, viewport } from '@telegram-apps/sdk-react';

// Объявляем, что в window может быть объект Telegram
declare global {
  interface Window {
    Telegram?: any;
  }
}

const isTelegram = typeof window !== 'undefined' && window.Telegram?.WebApp?.initData !== undefined && window.Telegram.WebApp.initData !== '';

async function initTelegram() {
  if (!isTelegram) {
    console.log("Игра запущена в браузере.");
    return;
  }

  try {
    init();
    if (miniApp.mount.isAvailable()) { await miniApp.mount(); }
    if (themeParams.mount.isAvailable()) {
      themeParams.mount();
      themeParams.bindCssVars.ifAvailable();
    }
    if (viewport.mount.isAvailable()) {
      await viewport.mount();
      viewport.expand.ifAvailable();
    }
  } catch (error) {
    console.error("Ошибка Telegram SDK:", error);
  }
}

initTelegram();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)