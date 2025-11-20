import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('auth_token');

            console.log("token: " + token);
            if (token) {
                headers.set("authorization", `Bearer ${token}`);
            }

            headers.set('Content-Type', 'application/json');
            return headers;
        },

    }),
    // Tags globaux pour l'invalidation des caches
    tagTypes: ['User', 'Auth', 'Book'],
    // Endpoints seront injectés dans les features
    endpoints: () => ({}),
})