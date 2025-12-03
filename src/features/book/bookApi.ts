import type {AddBookRequest, VolumeShort} from '../../types/book.types.ts';
import {apiSlice} from "../../services/apiSlice.ts";
import type {BookCopy} from '../../types/book.types.ts';

export const booksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUserBooks: builder.query<BookCopy[], {ownerEmail: string}>({
            query: () => ({
                url: '/book-copies/user/me',
                method: 'GET',
                providesTags: ['Book'],
            })
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

        addBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: '/book-copies/user/me',
                method: 'POST',
                body: bookData,
            }),
            invalidatesTags: ['Book'], // This will refetch getUserBooks after adding
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetUserBooksQuery,
    useGetBookSuggestionsQuery,
    useAddBookCopyMutation
} = booksApi;