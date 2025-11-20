import { apiSlice } from '../../services/apiSlice'
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
} from '../../types/auth.types'

// Injecter les endpoints dans l'apiSlice de base
export const authApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
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
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
} = authApi