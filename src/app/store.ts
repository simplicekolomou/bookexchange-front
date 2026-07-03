import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from '@reduxjs/toolkit/query'
import { baseApi } from '../services/baseApi.ts'
import messageReducer from "../features/message/messageSlice.ts";
import authReducer from "../features/auth/authSlice.ts";

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        message: messageReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
    devTools: import.meta.env.MODE !== 'production',
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch