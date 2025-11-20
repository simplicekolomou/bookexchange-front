import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BookTypes } from '../../types/book.types.ts';

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
        credentials: 'include',
    }),
    tagTypes: ['Book'],
    endpoints: (builder) => ({
        getUserBooks: builder.query<BookTypes[], void>({
            query: () => 'books',
            providesTags: ['Book'],
        }),
    }),
});

export const { useGetUserBooksQuery } = booksApi;