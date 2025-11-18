import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BookApi } from '../../types/bookApi.ts';

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
        credentials: 'include',
    }),
    tagTypes: ['Book'],
    endpoints: (builder) => ({
        getUserBooks: builder.query<BookApi[], void>({
            query: () => 'books',
            providesTags: ['Book'],
        }),
    }),
});

export const { useGetUserBooksQuery } = booksApi;