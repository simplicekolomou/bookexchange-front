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
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    // On attend que la requête HTTP réussisse avant d'agir
                    const { data } = await queryFulfilled;
                    // On stocke l'utilisateur connecté dans le slice auth
                    dispatch(setCredentials(data));
                    // On vide tout le cache RTK Query pour repartir sur des
                    // données fraîches liées à CE nouvel utilisateur
                    dispatch(baseApi.util.resetApiState());
                } catch { /* On gère l'erreur en cas d'échec dans le hook */ }
            },
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
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setCredentials(data));
                    dispatch(baseApi.util.resetApiState());
                } catch { /* empty */ }
            },
        }),

        // GET /me — hydrate le store au refresh de page
        getMe: builder.query<UserProfile, void>({
            query: () => ({
                url: `/me`,
                method: 'GET',
            }),
            providesTags: (result) =>
                    result ? [{type: "User", id: result.id}] : [],
        }),

        // Mot de passe oublié
        forgotPassword: builder.mutation<void, string>({
            query: (email) => ({
                url: `/forgot-password`,
                method: 'PUT',
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
        updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
            query: (data) => ({
                url: `/update-profile`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'User', id: result.id }] : [],
            async onQueryStarted(data, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(userProfileUpdated(data));
                } catch { /* empty */ }
            },
        }),

        // Chargement de la photo de profil
        getProfilePicture: builder.query<string, void>({
            query: () => ({
                url: `/users/me/profile-picture`,
                method: 'GET',
                // "responseHandler" intercepte la réponse HTTP BRUTE (avant que
                // RTK Query ne tente de la parser en JSON par défaut). On lui dit
                // ici comment transformer nous-mêmes cette réponse.
                responseHandler: async (response) => {
                    // "response" est l'objet Response natif du navigateur (Fetch API).
                    // ".blob()" lit le corps de la réponse et le transforme en objet Blob
                    // (représentation binaire du fichier, ici l'image de profil)
                    const blob = await response.blob();

                    // "URL.createObjectURL(blob)" demande au navigateur de créer une URL
                    // temporaire (de la forme "blob:http://localhost:3000/xxxx-xxxx")
                    // qui pointe vers ce blob EN MÉMOIRE. Cette URL est ensuite utilisable
                    // directement dans un <img src="blob:...">
                    return URL.createObjectURL(blob);
                },
            }),
            providesTags: ['Picture'],

            // "onQueryStarted" se déclenche à CHAQUE nouvelle requête déclenchée
            // par cette query — que ce soit le premier chargement, ou un refetch
            // après invalidation du tag 'Picture'. C'est ici qu'on peut nettoyer
            // l'ANCIENNE url blob avant que la nouvelle ne prenne sa place.
            async onQueryStarted(_arg, { getState, queryFulfilled }) {
                // On récupère l'URL actuellement en cache AVANT que la nouvelle
                // requête ne remplace la donnée. On utilise "authApi.endpoints
                // .getProfilePicture.select()(getState())" pour lire le cache
                // actuel sans déclencher de nouvelle requête.
                // Remplace "authApi" par le nom réel de ta variable createApi
                const previousUrl = authApi.endpoints.getProfilePicture.select()(
                    getState()
                ).data;

                try {
                    // On attend que la NOUVELLE requête réussisse
                    await queryFulfilled;

                    // Maintenant que la nouvelle URL est bien en cache, on peut
                    // libérer l'ANCIENNE en toute sécurité (elle n'est plus affichée,
                    // remplacée par la nouvelle valeur de "data")
                    if (previousUrl) {
                        URL.revokeObjectURL(previousUrl);
                    }
                } catch {
                    // Si le refetch échoue, on garde l'ancienne URL telle quelle
                    // (pas de nettoyage, rien à changer)
                }
            },

            // "onCacheEntryRemoved" est un callback fourni par RTK Query qui gère
            // le CYCLE DE VIE COMPLET d'une entrée de cache, du chargement jusqu'à
            // sa suppression définitive. Ses paramètres :
            // - "arg" : les arguments passés à la query (ici "void", donc inutilisé)
            // - "{ cacheDataLoaded, cacheEntryRemoved, getCacheEntry }" : des outils
            //   fournis par RTK Query pour observer ces différentes étapes
            async onCacheEntryAdded(
                _arg,
                { cacheDataLoaded, cacheEntryRemoved, getCacheEntry }
            ) {
                try {
                    // "cacheDataLoaded" est une Promise qui se résout dès que
                    // la première requête a réussi (donc dès qu'on a bien reçu
                    // une URL blob valide dans le cache). On l'attend avant de
                    // continuer, pour être sûr qu'il y a bien quelque chose à nettoyer.
                    await cacheDataLoaded;
                } catch {
                    // Si la requête initiale a échoué (erreur réseau, 404, etc.),
                    // il n'y a jamais eu d'URL blob créée : rien à nettoyer, on arrête ici.
                    return;
                }

                // "cacheEntryRemoved" est une Promise qui NE SE RÉSOUT QUE quand
                // RTK Query décide de supprimer VRAIMENT cette entrée de cache —
                // c'est-à-dire quand PLUS AUCUN composant dans toute l'application
                // n'utilise ce hook (après un court délai de grâce configurable,
                // par défaut 60 secondes, au cas où un composant se remonte vite).
                //
                // C'est la différence clé avec un useEffect classique : ce useEffect
                // se déclenche à CHAQUE démontage d'UN composant, alors qu'ici,
                // on attend que TOUS les composants soient partis.
                await cacheEntryRemoved;

                // À ce stade, on est certain qu'aucun composant n'affiche plus
                // cette image nulle part dans l'app. On peut donc libérer la
                // mémoire du navigateur en toute sécurité, sans risquer de casser
                // l'affichage d'un composant encore actif.
                //
                // "getCacheEntry()" permet de récupérer la donnée actuellement
                // en cache pour CETTE entrée précise (ici, l'URL blob elle-même,
                // qui est la valeur "data" de cette query).
                const currentImageUrl = getCacheEntry().data;

                if (currentImageUrl) {
                    URL.revokeObjectURL(currentImageUrl);
                }
            },
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
            providesTags: (result, _error, {userId}) =>
                    result ? [{type: "User", id: result.id}]
                        : [{type: "User", id: userId}],
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
                result
                    ? [
                        ...result.content.map(
                            (user) => ({ type: 'User' as const, id: user.id })
                        ),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        // Liste paginée de tous les utilisateurs
        getAllUsers: builder.query<PagedResponse<UserProfile>, { page: number; size: number }>({
            query: ({ page, size }) => ({
                url: `/users/all`,
                method: 'GET',
                params: { page, size },
            }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.content.map(
                            (user) => ({ type: 'User' as const, id: user.id })
                        ),
                        { type: 'User', id: 'LIST' },
                    ]
                    : [{ type: 'User', id: 'LIST' }],
        }),

        getWebsocketToken: builder.query<{ wsToken: string }, void>({
            query: () => ({
                url: `/ws-token`,
                method: 'GET',
            }),
            providesTags: ['WsToken'],
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
    useGetWebsocketTokenQuery,
} = authApi;