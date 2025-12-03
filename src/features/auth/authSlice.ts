import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type {AuthResponse, AuthState} from '../../types/auth.types'

const token = localStorage.getItem('auth_token')
const initialToken = token ? token : null

const initialState: AuthState = {
    token: initialToken,
    isAuthenticated: !!initialToken,
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // on reçoit uniquement { accessToken }
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.token = action.payload.accessToken
            state.isAuthenticated = true
            localStorage.setItem('auth_token', action.payload.accessToken)
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
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer