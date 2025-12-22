import {apiSlice} from "../../services/apiSlice.ts";
import type {UpdateProfileData, UserProfile} from "../../types/profile.types.ts";

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
        getUser: builder.query<UserProfile, { userId: string }>({
            query: ({ userId }) => ({
                url: `/users/${userId}`,
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),

        findUser: builder.query<UserProfile[], { firstName?: string, lastName?: string, size: number }>({
            query: ({ firstName, lastName, size = 10 }) => ({
                url: `/users/search`,
                method: 'GET',
                params: {
                    ...(firstName ? { firstName } : {}),
                    ...(lastName ? { lastName } : {}),
                    page: 0,
                    size
                },
            }),
            providesTags: ['Profile'],
        }),
    }),
});

export const {
    useUpdateUserProfileMutation,
    useUpdateProfilePictureMutation,
    useGetProfilePictureQuery,
    useGetUserQuery,
    useFindUserQuery,
} = profileApi;