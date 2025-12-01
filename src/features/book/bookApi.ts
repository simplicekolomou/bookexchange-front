import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {BookCopy} from '../../types/book.types.ts';

export const booksApi = createApi({
    reducerPath: 'booksApi',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/',
        credentials: 'include',
    }),
    tagTypes: ['Book'],
    endpoints: (builder) => ({
        getUserBooks: builder.query<BookCopy[], {ownerEmail: string}>({
            query: () => ({
                url: '/book-copies/user/me',
                method: 'GET',
                providesTags: ['Book'],
            })
        }),
    }),
});

export const { useGetUserBooksQuery } = booksApi;