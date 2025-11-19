import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import localStorage from "redux-persist/es/storage";

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            const token= localStorage.getItem('auth_token').then(reponse => {
                console.log(reponse);
                console.log(token);
                if (reponse) {
                    headers.set('Authorization', `Bearer ${reponse}`);
                }
                headers.set('content-type', 'application/json')
                console.log(headers)
            });
            return headers
        },
    }),
    // Tags globaux pour l'invalidation des caches
    tagTypes: ['User', 'Auth', 'Book'],
    // Endpoints seront injectés dans les features
    endpoints: () => ({}),
})