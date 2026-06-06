import {baseApi} from "../../../services/baseApi.ts";

const forgotPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        forgotPassword: builder.mutation<void, string>({
            query: (email: string) => ({
                url: '/forgot-password',
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: { email },
            }),
        }),
    }),
})

export const {
    useForgotPasswordMutation,
} = forgotPasswordApi