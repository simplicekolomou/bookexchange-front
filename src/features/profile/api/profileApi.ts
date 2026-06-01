import {baseApi} from "../../../services/baseApi.ts";
import type {UpdateProfileData, UserProfile} from "../types/profile.types.ts";
import type {PagedResponse} from "../../message/types/message.types.ts";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<UserProfile, void>({
            query: () => ({
                url: '/users/me',
                method: 'GET',
            }),
            providesTags: ['Profile'],
        }),
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

        findUser: builder.query<PagedResponse<UserProfile>, { firstName?: string, lastName?: string, size: number, page: number }>({
            query: ({ firstName, lastName, size, page }) => ({
                url: `/users/search`,
                method: 'GET',
                params: {
                    ...(firstName ? { firstName } : {}),
                    ...(lastName ? { lastName } : {}),
                    page,
                    size,
                },
            }),
            providesTags: ['Profile'],
        }),

        getAllUsers: builder.query<PagedResponse<UserProfile>, { page: number; size: number }>({
            query: ({ page, size }) => ({
                url: `/users/all`,
                method: 'GET',
                params: {
                    page,
                    size
                }
            }),
            providesTags: ['Users'],
        }),

        getCurrentUser: builder.query<UserProfile, void>({
            query: () => ({
                url: `/users/me`,
                method: 'GET',
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
    useGetAllUsersQuery,
    useGetCurrentUserQuery,
    useGetProfileQuery,
} = profileApi;