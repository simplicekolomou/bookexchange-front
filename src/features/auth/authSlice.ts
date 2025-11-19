import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import type {AuthResponse, AuthState, User} from '../../types/auth.types'

const getStoredAuth = (): { token: string | null; user: User | null } => {
    try {
        const token = localStorage.getItem('auth_token')
        const user = localStorage.getItem('auth_user')
        return {
            token,
            user: user ? JSON.parse(user) : null,
        }
    } catch(error) {
        return { token: null, user: null }
    }
}

const { token: initialToken, user: initialUser } = getStoredAuth()

const initialState: AuthState = {
    user: initialUser,
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.token = action.payload.accessToken
            state.isAuthenticated = true

            localStorage.setItem('auth_token', action.payload.accessToken)
        },
        logout: (state) => {
            state.token = null

            localStorage.removeItem('auth_token')
        },
    },
    // Écouter les actions des endpoints API
    extraReducers: (builder) => {
        builder
            // Login successful
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    state.token = payload.accessToken
                    state.isAuthenticated = true
                }
            )
            // Logout successful
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                (state) => {
                    state.token = null

                    localStorage.removeItem('auth_token')
                }
            )
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer