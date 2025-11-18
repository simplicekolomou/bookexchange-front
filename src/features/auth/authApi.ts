import { apiSlice } from '../../services/apiSlice'
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse, User
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
        logout: builder.mutation<void, void>({
            // Pas de requête au backend — on met à jour localement et on invalide le cache
            queryFn: async () => ({ data: undefined }),
            invalidatesTags: ['Auth', 'User'],
        }),
        getCurrentUser: builder.query<User, void>({
            query: () => '/me',
            providesTags: ['User'],
        }),
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useGetCurrentUserQuery,
} = authApi