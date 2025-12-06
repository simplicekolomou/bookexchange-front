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
        searchBook: builder.mutation<BookCopy, string>({
            query: (keyword) => ({
                url: `books/search`,
                method: 'POST',
                body: keyword
            }),
        }),
    }),
});

export const { useSearchBookMutation } = booksApi;