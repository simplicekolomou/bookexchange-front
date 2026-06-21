import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {logout} from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    // Forcer la base URL à être dynamique en fonction de l'origine de la page
    baseUrl: `${window.location.origin}/api`,
    credentials: 'include', // Envoie le cookie avec chaque requête
    prepareHeaders: (headers) => {
        return headers;
    },
});

/**
 * Interceptes les réponses d'erreur pour gérer les statuts 401 et 403.
 * En cas de réception de ces statuts, déclenche une action de déconnexion.
 *
 * @param args          Les arguments de la requête
 * @param api           La base API RTK Query
 * @param extraOptions  Les options supplémentaires
 * @returns             Le résultat de la requête, ou déclenche une déconnexion en cas d'erreur 401/403
 */

export const baseQueryWithUnauthorizedHandler: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    const status = result.error?.status;

    if (status === 401 || status === 403) {
        api.dispatch(logout());
    }

    return result;
};
