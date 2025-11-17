import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { authApi } from './authApi'
import type { AuthState, User } from '../../types/auth.types'

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
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true

            localStorage.setItem('auth_token', action.payload.token)
            localStorage.setItem('auth_user', JSON.stringify(action.payload.user))
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false

            localStorage.removeItem('auth_token')
            localStorage.removeItem('auth_user')
        },
    },
    // Écouter les actions des endpoints API
    extraReducers: (builder) => {
        builder
            // Login successful
            .addMatcher(
                authApi.endpoints.login.matchFulfilled,
                (state, { payload }) => {
                    state.user = payload.user
                    state.token = payload.token
                    state.isAuthenticated = true

                    localStorage.setItem('auth_token', payload.token)
                    localStorage.setItem('auth_user', JSON.stringify(payload.user))
                }
            )
            // Logout successful
            .addMatcher(
                authApi.endpoints.logout.matchFulfilled,
                (state) => {
                    state.user = null
                    state.token = null
                    state.isAuthenticated = false

                    localStorage.removeItem('auth_token')
                    localStorage.removeItem('auth_user')
                }
            )
    },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer