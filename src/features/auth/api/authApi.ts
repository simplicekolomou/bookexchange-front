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

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // Login — backend renvoie User, token dans le cookie httpOnly
        login: builder.mutation<UserProfile, LoginCredentials>({
            query: (credentials) => ({
                url: `/login`,
                method: 'POST',
                body: credentials,
            }),
        }),

        logout: builder.mutation<void, void>({
            query: () => ({
                url: `/logout`,
                method: 'POST',
            }),
        }),

        // Register
        register: builder.mutation<UserProfile, RegisterCredentials>({
            query: (credentials) => ({
                url: `/register`,
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'Auth', id: result.id }] : ['Auth'],
        }),

        // GET /me — hydrate le store au refresh de page
        getMe: builder.query<UserProfile, void>({
            query: () => ({
                url: `/me`,
                method: 'GET',
            }),
            providesTags: (result) =>
                    result ? [{ type: 'Auth', id: result.id }] : ['Auth'],
        }),

        // Mot de passe oublié
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: `/forgot-password`,
                method: 'PUT',
                body: { email },
            }),
        }),

        // Reset password
        resetPassword: builder.mutation<UserProfile, ResetPasswordRequest>({
            query: (body) => ({
                url: `/reset-password`,
                method: 'POST',
                body,
            }),
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
        updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
            query: (data) => ({
                url: `/update-profile`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result) =>
                result ? [{type: "Profile", id: result.id}] : ["Profile"]
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
            }),
            providesTags: (result) =>
                result ? [{ type: 'Picture', id: result }] : ['Picture'],
        }),

        // Mise à jour de la photo
        updateProfilePicture: builder.mutation<{ profilePicture: string }, FormData>({
            query: (formData) => ({
                url: `/update-profile-picture`,
                method: 'PUT',
                body: formData,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'Picture', id: result.profilePicture }] : ['Picture'],
        }),

        // Profil d'un utilisateur par id
        getUser: builder.query<UserProfile, { userId?: string }>({
            query: ({ userId }) => `/users/${userId}`,
            providesTags: (result) =>
                result ? [{type: 'Profile', id : result.id}]:['Profile'],
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
            providesTags: (result) =>
                result ? result.content.map((user) => ({ type: 'User', id: user.id })) : ['User'],
        }),

        // Liste paginée de tous les utilisateurs
        getAllUsers: builder.query<PagedResponse<UserProfile>, { page: number; size: number }>({
            query: ({ page, size }) => ({
                url: `/users/all`,
                method: 'GET',
                params: { page, size },
            }),
            providesTags: (result) =>
                    result ? result.content.map((user) => ({ type: 'User', id: user.id })) : ['User'],
        }),

        getWebsocketToken: builder.query<{ wsToken: string }, void>({
            query: () => ({
                url: `/ws-token`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result ? [{ type: 'WsToken', id: result.wsToken }] : ['WsToken'],
        }),
    }),

    // Pour contrôler le comportement lors d'un conflit de noms
    // si tu essaies d'injecter un endpoint qui porte déjà le même
    // nom qu'un endpoint existant, RTK Query lève une erreur et n'écrase pas l'ancien
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
    useGetWebsocketTokenQuery,
} = authApi;