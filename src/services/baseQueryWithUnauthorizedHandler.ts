import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import {logout, selectCurrentToken} from '../features/auth/authSlice';
import type {RootState} from "../app/store.ts";

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const state = getState() as RootState;
        const token = selectCurrentToken(state);
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        headers.set('content-type', 'application/json');
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
    const status = result.error?.status as number | string | undefined;
    if (status === 403 || status === '403' || status === 401 || status === '401') {
        api.dispatch(logout());
    }

    return result;
};
