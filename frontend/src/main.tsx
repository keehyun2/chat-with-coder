import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { LanguageProvider } from './i18n/LanguageContext'
import './index.css'

// Prism.js must be imported before components that use it
import 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
