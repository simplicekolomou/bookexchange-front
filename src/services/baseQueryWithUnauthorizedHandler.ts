import {
    fetchBaseQuery,
    type BaseQueryFn,
    type FetchArgs,
    type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { logout } from '../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
    prepareHeaders: (headers) => {
        const token = localStorage.getItem("auth_token");
        if (token) {
            headers.set('authorization', `Bearer ${token}`)
        }
        headers.set('content-type', 'application/json')
        return headers
    },
});

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
