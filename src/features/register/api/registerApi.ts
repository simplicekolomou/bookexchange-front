import { baseApi } from '../../../services/baseApi.ts'
import type {AuthResponse, RegisterCredentials} from "../../auth/types/auth.types.ts";

// Injecter les endpoints dans l'baseApi de base
export const registerApi = baseApi.injectEndpoints({
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