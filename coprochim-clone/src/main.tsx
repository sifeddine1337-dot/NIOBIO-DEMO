import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { CartProvider } from './contexts/CartProvider'
import { LanguageProvider } from './contexts/LanguageProvider'
import { loadCatalogFromServer } from './data/sync'
import './styles/variables.css'
import './styles/reset.css'
import './styles/global.css'

// The static catalog is already loaded, so the storefront renders immediately.
// When the admin API is reachable its (authoritative) catalog replaces it.
void loadCatalogFromServer()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
