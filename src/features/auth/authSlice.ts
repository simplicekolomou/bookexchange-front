import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse, AuthState } from './types/auth.types.ts'
import { baseApi } from "../../services/baseApi.ts"
import type {RootState} from "../../app/store.ts";

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    user: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            baseApi.util.resetApiState()
        },
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

// Selectors typés avec RootState
export const selectCurrentUser = (state: RootState) => state.auth.user
export const selectCurrentToken = (state: RootState) => state.auth.token
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectCurrentUserId = (state: RootState) => state.auth.user?.id