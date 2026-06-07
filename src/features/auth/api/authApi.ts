import { baseApi } from '../../../services/baseApi.ts'
import type {
    LoginCredentials,
    RegisterCredentials,
    AuthResponse,
    ResetPasswordRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
} from '../types/auth.types.ts'
import {setCredentials, userPictureUpdated, userProfileUpdated} from '../authSlice.ts'
import type {UserProfile} from "../profile/types/profile.types.ts";
import type {PagedResponse} from "../../message/types/message.types.ts";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Auth de base
        login: builder.mutation<AuthResponse, LoginCredentials>({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Auth'],
            // On hydrate authSlice dès le login
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(setCredentials(data));
            },
        }),

        // Inscription
        register: builder.mutation<AuthResponse, RegisterCredentials>({
            query: (credentials) => ({
                url: '/register',
                method: 'POST',
                body: credentials,
            }),
            // On connecte automatiquement l'utilisateur après inscription
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(setCredentials(data));
            },
        }),

        // Mot de passe oublié
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: '/forgot-password',
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: { email },
            }),
        }),

        // Réinitialisation du mot de passe
        resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
            query: (body) => ({
                url: '/reset-password',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Auth'],
        }),

        // Mise à jour du mot de passe
        updatePassword: builder.mutation<void, UpdatePasswordRequest>({
            query: (data) => ({
                url: '/update-password',
                method: 'PUT',
                body: data,
            }),
        }),

        // Mise à jour du profil de l'utilisateur connecté
        updateProfile: builder.mutation<void, UpdateProfileRequest>({
            query: (data) => ({
                url: '/update-profile',
                method: 'PUT',
                body: data,
            }),
            // On dispatche l'action dédiée du slice, pas setCredentials
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled
                    dispatch(userProfileUpdated(data))
                } catch { /* empty */ }
            },
        }),

        // Récupération de la photo de profil de l'utilisateur connecté
        getProfilePicture: builder.query<string, void>({
            query: () => ({
                url: '/users/me/profile-picture',
                method: 'GET',
                responseHandler: async (response) => {
                    const blob = await response.blob();
                    return URL.createObjectURL(blob);
                },
                cache: 'no-cache',
            }),
            providesTags: ['Picture'],
        }),

        // Mise à jour de la photo de profil de l'utilisateur connecté
        updateProfilePicture: builder.mutation<{ profilePicture: string }, FormData>({
            query: (formData) => ({
                url: '/update-profile-picture',
                method: 'PUT',
                body: formData,
            }),
            // Invalide le cache de la photo après upload → refetch automatique
            invalidatesTags: ['Picture'],
            async onQueryStarted(_, { dispatch, queryFulfilled}) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(userPictureUpdated(data.profilePicture)); // met à jour l'extension dans authSlice
                } catch { /* empty */ }
            },
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
    overrideExisting: false,
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useUpdatePasswordMutation,
    useUpdateProfileMutation,
    useUpdateProfilePictureMutation,
    useGetProfilePictureQuery,
    useGetUserQuery,
    useFindUserQuery,
    useGetAllUsersQuery,
    useGetCurrentUserQuery,
} = authApi;