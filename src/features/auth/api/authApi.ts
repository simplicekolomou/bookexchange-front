import { baseApi } from '../../../services/baseApi.ts'
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse, ResetPasswordRequest,
} from '../types/auth.types.ts'

// Injecter les endpoints dans l'baseApi de base
export const authApi = baseApi.injectEndpoints({
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

        updatePassword: builder.mutation<void, {currentPassword: string; newPassword: string}>({
            query: (data) => ({
                url: '/update-password',
                method: 'PUT',
                body: data,
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
    useUpdatePasswordMutation,
} = authApi