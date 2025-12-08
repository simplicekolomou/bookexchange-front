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
            invalidatesTags: ['Picture'],
        }),

        updateUserProfile: builder.mutation<void, UpdateProfileData>({
            query: (updateInfo) => ({
                url: `/users/me`,
                method: 'PUT',
                body: updateInfo,
            }),
            invalidatesTags: ['Profile'],
        }),

        getProfilePicture: builder.query<string, void>({
            query: () => ({
                url: '/users/me/profile-picture',
                method: 'GET',
                responseHandler: async (response) => {
                    console.log("Reponse du back : ", response);
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: 'no-cache',
            }),
            providesTags: ['Picture'],
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
    }),
});

export const {
    useUpdateUserProfileMutation,
    useUpdateProfilePictureMutation,
    useGetProfilePictureQuery,
    useChangePasswordMutation,
} = profileApi;