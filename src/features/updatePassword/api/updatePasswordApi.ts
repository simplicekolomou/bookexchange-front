import {baseApi} from "../../../services/baseApi.ts";

export const resetPasswordApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updatePassword: builder.mutation<void, {currentPassword: string; newPassword: string}>({
            query: (data) => ({
                url: '/update-password',
                method: 'PUT',
                body: data,
            }),
        }),
    }),
})

export const {
    useUpdatePasswordMutation,
} = resetPasswordApi