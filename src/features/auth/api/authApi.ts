import { baseApi } from '../../../services/baseApi.ts'
import type {
    LoginCredentials,
    RegisterCredentials,
    ResetPasswordRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
} from '../types/auth.types.ts'
import type { UserProfile } from "../profile/types/profile.types.ts"
import type { PagedResponse } from "../../message/types/message.types.ts"
import {
    setCredentials,
    userPictureUpdated,
    userProfileUpdated,
    logout,
} from '../authSlice.ts'

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Login — backend renvoie User, token dans le cookie httpOnly
        login: builder.mutation<UserProfile, LoginCredentials>({
            query: (credentials) => ({
                url: `/login`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data)); // User directement, plus AuthResponse
                } catch { /* empty */ }
            },
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: `/logout`,
                method: 'POST',
            }),
            invalidatesTags: ['Auth'],
        }),

        // Register
        register: builder.mutation<UserProfile, RegisterCredentials>({
            query: (credentials) => ({
                url: `https://bookexchange-api-production.up.railway.app/register`,
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch { /* empty */ }
            },
        }),

        // GET /me — hydrate le store au refresh de page
        getMe: builder.query<UserProfile, void>({
            query: () => ({
                url: `https://bookexchange-api-production.up.railway.app/me`,
                method: 'GET',
            }),
            providesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data)); // réhydratation au refresh
                } catch {
                    dispatch(logout()); // cookie absent ou expiré
                }
            },
        }),

        // Mot de passe oublié
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: `/forgot-password`,
                method: 'PUT',
                // body simple — RTK Query gère le Content-Type
                body: { email },
            }),
        }),

        // Reset password — hydrate le store après reset
        resetPassword: builder.mutation<UserProfile, ResetPasswordRequest>({
            query: (body) => ({
                url: `/reset-password`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                } catch { /* empty */ }
            },
        }),

        // Mise à jour du mot de passe
        updatePassword: builder.mutation<void, UpdatePasswordRequest>({
            query: (data) => ({
                url: `/update-password`,
                method: 'PUT',
                body: data,
            }),
        }),

        // Mise à jour du profil
        updateProfile: builder.mutation<void, UpdateProfileRequest>({
            query: (data) => ({
                url: `/update-profile`,
                method: 'PUT',
                body: data,
            }),
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userProfileUpdated(data));
                } catch { /* empty */ }
            },
        }),

        // Photo de profil
        getProfilePicture: builder.query<string, void>({
            query: () => ({
                url: `/users/me/profile-picture`,
                method: 'GET',
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: 'no-cache',
            }),
            providesTags: ['Picture'],
        }),

        // Mise à jour de la photo
        updateProfilePicture: builder.mutation<{ profilePicture: string }, FormData>({
            query: (formData) => ({
                url: `/update-profile-picture`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: ['Picture'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userPictureUpdated(data.profilePicture));
                } catch { /* empty */ }
            },
        }),

        // Profil d'un utilisateur par id
        getUser: builder.query<UserProfile, { userId?: string }>({
            query: ({ userId }) => `/users/${userId}`,
            providesTags: ['Profile'],
        }),

        // Recherche d'utilisateurs
        findUser: builder.query<PagedResponse<UserProfile>, {
            firstName?: string;
            lastName?: string;
            size: number;
            page: number;
        }>({
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

        // Liste paginée de tous les utilisateurs
        getAllUsers: builder.query<PagedResponse<UserProfile>, { page: number; size: number }>({
            query: ({ page, size }) => ({
                url: `/users/all`,
                method: 'GET',
                params: { page, size },
            }),
            providesTags: ['Users'],
        }),
    }),
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useGetMeQuery,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    useUpdateProfileMutation,
    useUpdateProfilePictureMutation,
    useGetProfilePictureQuery,
    useGetUserQuery,
    useFindUserQuery,
    useGetAllUsersQuery,
    useLogoutMutation,
} = authApi;