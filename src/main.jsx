import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Expose analysis utilities to browser console for debugging
import { analyzeBasketballModels } from './utils/basketballModelAnalysis.js'
window.analyzeBasketballModels = analyzeBasketballModels;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)