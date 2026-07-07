import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState } from './types/auth.types.ts'
import type { RootState } from '../../app/store.ts'
import type {UserProfile} from "./profile/types/profile.types.ts";
import {authApi} from "./api/authApi.ts";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {

        // Hydratation après login / register / GET me
        setCredentials: (state, action: PayloadAction<UserProfile>) => {
            state.user = action.payload
            state.isAuthenticated = true
        },

        // Logout — isAuthenticated dérivé de user !== null
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
            state.token = null
        }
    },
})

export const {
    setCredentials,
    logout,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser = (state: RootState) =>
    authApi.endpoints.getMe.select()(state).data;
export const selectIsAuthenticated = (state: RootState) =>
    authApi.endpoints.getMe.select()(state).isSuccess;
export const selectCurrentUserId   = (state: RootState) => state.auth.user?.id
export const selectUserPicture     = (state: RootState) => state.auth.user?.profilePicture ?? null