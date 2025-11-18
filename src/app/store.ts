import {configureStore} from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query'
import { apiSlice } from '../services/apiSlice'
import authReducer from '../features/auth/authSlice'
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'


const authPersistConfig = {
    key: 'auth',
    storage,
    whitelist: ['user', 'token', 'isAuthenticated']
}

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

export const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: persistedAuthReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(apiSlice.middleware),
        devTools: import.meta.env.MODE !== 'production',
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
