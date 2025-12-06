import { apiSlice } from '../../services/apiSlice'
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse, ResetPasswordRequest,
} from '../../types/auth.types'

// Injecter les endpoints dans l'apiSlice de base
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials
            }),
            invalidatesTags: ['Auth'],
        }),
        register: builder.mutation<AuthResponse, RegisterCredentials>({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            }),
        }),

        forgotPassword: builder.mutation<void, string>({
            query: (email: string) => ({
                url: '/forgot-password',
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: { email },
            }),
        }),


        resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
            query: (body) => ({
                url: '/reset-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),

    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useResetPasswordMutation,
    useForgotPasswordMutation,
} = authApi