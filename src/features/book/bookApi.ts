import type {AddBookRequest, VolumeShort} from '../../types/book.types.ts';
import {apiSlice} from "../../services/apiSlice.ts";
import type {BookCopy} from '../../types/book.types.ts';

export const booksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyBooks: builder.query<BookCopy[], void>({
            query: () => ({
                url: '/book-copies/user/me',
                method: 'GET',
                providesTags: ['Book'],
            })
        }),

        getMyBookCopy: builder.query<BookCopy[], { copyId: number }>({
            query: ({ copyId }) => ({
                url: `/book-copies/user/me/copy/${copyId}`,
                method: "GET",
            }),
        }),

        getUserBooks: builder.query<BookCopy[], { userId: number }>({
            query: ({ userId }) => ({
                url: `/book-copies/user/${userId}`,
                method: "GET",
            }),
            providesTags: ["Book"],
        }),

        getUserBookCopy: builder.query<BookCopy[], { userId: number; copyId: number }>({
            query: ({ userId, copyId }) => ({
                url: `/book-copies/user/${userId}/copy/${copyId}`,
                method: "GET",
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
    useGetMyBooksQuery,
    useGetMyBookCopyQuery,
    useGetUserBooksQuery,
    useGetUserBookCopyQuery,
    useGetBookSuggestionsQuery,
    useAddBookCopyMutation
} = booksApi;