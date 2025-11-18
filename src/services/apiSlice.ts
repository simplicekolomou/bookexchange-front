import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from '../app/store'

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api',
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }
            headers.set('content-type', 'application/json')
            return headers
        },
    }),
    // Tags globaux pour l'invalidation des caches
    tagTypes: ['User', 'Auth'],
    // Endpoints seront injectés dans les features
    endpoints: () => ({}),
})