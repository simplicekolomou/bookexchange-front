import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './components/App.tsx'
import { Provider  as UIProvider} from "./components/ui/provider"
import "./i18n"
import {store} from "./app/store";
import { Provider } from 'react-redux'
import {BrowserRouter} from "react-router-dom";
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './app/store'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <UIProvider>
              <PersistGate loading={null} persistor={persistor}>
                  <BrowserRouter>
                    <App />
                  </BrowserRouter>
              </PersistGate>
          </UIProvider>
      </Provider>
  </StrictMode>,
)
