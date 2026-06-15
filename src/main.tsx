import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider  as UIProvider} from "./theme/provider.tsx"
import "./i18n"
import {store} from "./app/store";
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './app/store'
import {AppProvider} from "./app/provider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <Provider store={store}>
          <UIProvider>
              <PersistGate loading={null} persistor={persistor}>
                  <AppProvider />
              </PersistGate>
          </UIProvider>
      </Provider>
  </StrictMode>,
)
