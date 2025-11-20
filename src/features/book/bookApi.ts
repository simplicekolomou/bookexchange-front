import type {BookApi, VolumeShort} from '../../types/bookApi.ts';
import {apiSlice} from "../../services/apiSlice.ts";

export const booksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserBooks: builder.query<BookApi[], void>({
            query: () => ({
                    url: '/books',
                    method: 'GET',
                }),
            providesTags: ['Book'],
        }),

        getBookSuggestions: builder.query<
            VolumeShort[],
            { title?: string; author?: string; lang?: string; limit?: number }
        >({
            query: ({ title, author, lang = 'fre', limit = 10 }) => ({
                url: '/books/search',
                method: 'GET',
                params: {
                    ...(title ? { title } : {}),
                    ...(author ? { author } : {}),
                    lang,
                    page: 1,
                    limit,
                },
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUserBooksQuery,
    useGetBookSuggestionsQuery,
} = booksApi;