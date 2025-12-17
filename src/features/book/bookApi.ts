import type {AddBookRequest, BookCopyAndOwner, VolumeShort} from '../../types/book.types.ts';
import {apiSlice} from "../../services/apiSlice.ts";
import type {BookCopy} from '../../types/book.types.ts';
import type {UserProfile} from "../../types/profile.types.ts";

export const booksApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMyBooks: builder.query<BookCopy[], void>({
            query: () => ({
                url: '/book-copies/user/me',
                method: 'GET',
                providesTags: ['Book'],
            })
        }),

        getBookCopy: builder.query<BookCopy, { copyId: number }>({
            query: ({ copyId }) => ({
                url: `/book-copies/${copyId}`,
                method: "GET",
            }),
            providesTags: ["Book"]
        }),

        getBookOwner: builder.query<UserProfile, {userId: number}>({
            query: ({ userId }) => ({
                url: `/users/${userId}`,
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

        addBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: '/book-copies/user/me',
                method: 'POST',
                body: bookData,
            }),
            invalidatesTags: ['Book'], // This will refetch getUserBooks after adding
        }),

        updateBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: '/book-copies/user/me',
                method: 'PUT',
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

        findBook: builder.query<VolumeShort[], { isbn?: string; author?: string; title?: string }>({
            query: ({ isbn, author, title }) => ({
                url: '/book-copies/search',
                method: 'GET',
                params: {
                    ...(isbn ? { isbn } : {}),
                    ...(author ? { author } : {}),
                    ...(title ? { title } : {}),
                },
            }),
            providesTags: ['Book'],
        }),

        findBookCopyAndOwner: builder.query<BookCopyAndOwner[], void>({
            query: () => ({
                url: '/book-copies/search/books-and-owners',
                method: 'GET',
            }),
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetMyBooksQuery,
    useGetBookCopyQuery,
    useGetBookOwnerQuery,
    useGetUserBooksQuery,
    useGetBookSuggestionsQuery,
    useAddBookCopyMutation,
    useUpdateBookCopyMutation,
    useFindBookQuery,
    useFindBookCopyAndOwnerQuery,
} = booksApi;