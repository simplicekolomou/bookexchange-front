import {apiSlice} from "../../services/apiSlice.ts";
import type {ChangePasswordData, UpdateProfileData} from "../../types/profile.types.ts";

export const profileApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateProfilePicture: builder.mutation<void, File>({
            query: (photoFile) => {
                return {
                    url: '/users/me/profile-picture',
                    method: 'PUT',
                    body: photoFile,
                };
            },
            invalidatesTags: ['User'],
        }),
        /*updateProfilePicture: builder.mutation<void, string>({
            query: (pictureUrl) =>({
                url: `/users/me/profile-picture`,
                method: 'PUT',
                body: pictureUrl,
            })
        }),*/

        updateUserProfile: builder.mutation<void, UpdateProfileData>({
            query: (updateInfo) => ({
                url: `/users/me`,
                method: 'PUT',
                body: updateInfo,
            }),
            invalidatesTags: ['Profile'],
        }),

        changePassword: builder.mutation<void, { userId: string; data: ChangePasswordData }>({
            query: ({ userId, data }) => ({
                url: `/users/${userId}/password`,
                method: 'PUT',
                body: {
                    currentPassword: data.currentPassword,
                    newPassword: data.newPassword,
                },
            }),
        }),

        /*uploadAvatar: builder.mutation<{ avatarUrl: string }, { userId: string; formData: FormData }>({
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
        }),*/
    }),
});

export const {
    useUpdateUserProfileMutation,
    useUpdateProfilePictureMutation,
    useChangePasswordMutation,
} = profileApi;