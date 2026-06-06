import {baseApi} from "../../../services/baseApi.ts";
import type {AuthResponse, ResetPasswordRequest} from "../../auth/types/auth.types.ts";

export const resetPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
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
    useResetPasswordMutation,
} = resetPasswordApi