import { baseApi } from '../../../services/baseApi.ts'
import type {
    LoginCredentials,
    AuthResponse,
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
    }),
})

export const {
    useLoginMutation,
} = authApi