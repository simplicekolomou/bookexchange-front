import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthResponse, AuthState, UpdateProfileRequest } from './types/auth.types.ts'
import type { RootState } from '../../app/store.ts'

const initialState: AuthState = {
    token: null,
    isAuthenticated: false,
    isLoading: false,
    user: null,
    userProfile: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login / Register — hydrate tout le state
        setCredentials: (state, action: PayloadAction<AuthResponse>) => {
            state.token = action.payload.accessToken
            state.user = action.payload.user
            state.isAuthenticated = true
            state.userProfile = action.payload.user
        },

        // Mise à jour partielle du profil connecté (après updateProfile)
        userProfileUpdated: (state, action: PayloadAction<Partial<UpdateProfileRequest>>) => {
            if (state.userProfile) {
                state.userProfile = { ...state.userProfile, ...action.payload }
            }
        },

        // Mise à jour de la photo uniquement (après updateProfilePicture)
        userPictureUpdated: (state, action: PayloadAction<string>) => {
            if (state.userProfile) {
                state.userProfile.profilePicture = action.payload
            }
        },

        // Logout propre — pas de couplage avec baseApi ici
        logout: (state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
        },
    },
})

export const { setCredentials, userProfileUpdated, userPictureUpdated, logout } = authSlice.actions
export default authSlice.reducer

// Selectors
export const selectCurrentUser      = (state: RootState) => state.auth.user
export const selectCurrentToken     = (state: RootState) => state.auth.token
export const selectIsAuthenticated  = (state: RootState) => state.auth.isAuthenticated
export const selectCurrentUserId    = (state: RootState) => state.auth.user?.id
export const selectUserPicture      = (state: RootState) => state.auth.userProfile?.profilePicture ?? null
export const selectUserProfile = (state: RootState) => state.auth.userProfile