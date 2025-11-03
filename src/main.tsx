import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import { Provider } from "./components/ui/provider"
import "./i18n"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider>
          <App />
      </Provider>
  </StrictMode>,
)
