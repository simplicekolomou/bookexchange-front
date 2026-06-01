import { apiSlice } from '../../../services/apiSlice.ts'
import type {AuthResponse, RegisterCredentials} from "../../auth/types/auth.types.ts";

// Injecter les endpoints dans l'apiSlice de base
export const registerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
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
    useRegisterMutation,
} = registerApi