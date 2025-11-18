import {apiSlice} from "../../services/apiSlice.ts";
import type {UserProfile} from "../../types/user.types.ts";

export const userApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<UserProfile, string>({
            query: (userId) => `/users/${userId}`,
            providesTags: (_result, _error, userId) => [{ type: 'User', id: userId }],
        }),

        updateUserProfile: builder.mutation<UserProfile, { userId: string; updates: Partial<UserProfile> }>({
            query: ({ userId, updates }) => ({
                url: `/users/${userId}`,
                method: 'PATCH',
                body: updates,
            }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
        }),

        changePassword: builder.mutation<void, { userId: string; currentPassword: string; newPassword: string }>({
            query: (credentials) => ({
                url: `/users/${credentials.userId}/password`,
                method: 'PUT',
                body: {
                    currentPassword: credentials.currentPassword,
                    newPassword: credentials.newPassword,
                },
            }),
        }),

        uploadAvatar: builder.mutation<{ avatarUrl: string }, { userId: string; formData: FormData }>({
            query: ({ userId, formData }) => ({
                url: `/users/${userId}/avatar`,
                method: 'POST',
                body: formData,
            }),
            invalidatesTags: (_result, _error, { userId }) => [{ type: 'User', id: userId }],
        }),

        deleteAccount: builder.mutation<void, { userId: string; password: string }>({
            query: (credentials) => ({
                url: `/users/${credentials.userId}`,
                method: 'DELETE',
                body: { password: credentials.password },
            }),
        }),
    }),
});

export const {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
    useUploadAvatarMutation,
    useDeleteAccountMutation,
} = userApi;