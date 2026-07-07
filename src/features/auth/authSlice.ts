import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthState } from './types/auth.types.ts'
import type { RootState } from '../../app/store.ts'
import type {UserProfile} from "./profile/types/profile.types.ts";

const initialState: AuthState = {
    isAuthenticated: false,
    user: null,
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

        // Mise à jour partielle du profil
        /*userProfileUpdated: (state, action: PayloadAction<Partial<UpdateProfileRequest>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload }
            }
        },*/

        // Mise à jour de la photo uniquement
        /*userPictureUpdated: (state, action: PayloadAction<string>) => {
            if (state.user) {
                state.user.profilePicture = action.payload
            }
        },*/

        // Logout — isAuthenticated dérivé de user !== null
        logout: (state) => {
            state.user = null
            state.isAuthenticated = false
        }
    },
})

export const {
    setCredentials,
    logout,
} = authSlice.actions

export default authSlice.reducer

// Selectors
export const selectCurrentUser     = (state: RootState) => state.auth.user
export const selectIsAuthenticated = (state: RootState) => state.auth.user !== null // ✅ dérivé
export const selectCurrentUserId   = (state: RootState) => state.auth.user?.id
export const selectUserPicture     = (state: RootState) => state.auth.user?.profilePicture ?? null