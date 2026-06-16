import type {AddBookRequest, VolumeShort, WishlistItem} from '../types/book.types.ts';
import {baseApi} from "../../../services/baseApi.ts";
import type {BookCopy} from '../types/book.types.ts';
import type {UserProfile} from "../../auth/profile/types/profile.types.ts";
import type {PagedResponse} from "../../message/types/message.types.ts";

const apiBaseUrl = import.meta.env.VITE_API_URL;
export const booksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyBooks: builder.query<BookCopy[], void>({
            query: () => ({
                url: `${apiBaseUrl}/book-copies/user/me`,
                method: 'GET',
            }),
            providesTags: ['Book'],
        }),

        getBookCopy: builder.query<BookCopy, { copyId: number }>({
            query: ({ copyId }) => ({
                url: `${apiBaseUrl}/book-copies/${copyId}`,
                method: 'GET',
            }),
            providesTags: ['Book']
        }),

        getBookOwner: builder.query<UserProfile, {userId: number}>({
            query: ({ userId }) => ({
                url: `${apiBaseUrl}/users/${userId}`,
                method: 'GET',
            }),
        }),

        getUserBooks: builder.query<BookCopy[], { userId: number }>({
            query: ({ userId }) => ({
                url: `${apiBaseUrl}/book-copies/user/${userId}`,
                method: 'GET',
            }),
            providesTags: ['Book'],
        }),

        addBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `${apiBaseUrl}/book-copies/user/me`,
                method: 'POST',
                body: bookData,
            }),
            invalidatesTags: ['Book'], // This will refetch getUserBooks after adding
        }),

        updateBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `${apiBaseUrl}/book-copies/user/me`,
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
                url: `${apiBaseUrl}/books/search`,
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

        findBook: builder.query<PagedResponse<BookCopy>, { isbn?: string; author?: string; title?: string; size?: number, page?: number, availability?: string, bookState?: string }>({
            query: ({ isbn, author, title, size, page, availability, bookState }) => ({
                url: `${apiBaseUrl}/book-copies/search/book`,
                method: 'GET',
                params: {
                    ...(isbn ? { isbn } : {}),
                    ...(author ? { author } : {}),
                    ...(title ? { title } : {}),
                    ...(availability ? { availability } : {}),
                    ...(bookState ? { bookState } : {}),
                    page,
                    size,
                },
            }),
            providesTags: ['Book'],
        }),

        addBookCopyToWishList: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `${apiBaseUrl}/book-wish/user/me`,
                method: 'POST',
                body: bookData,
            }),
             invalidatesTags: ['WishList'],
        }),

        getMyWishList: builder.query<WishlistItem[], void>({
            query: () => ({
                url: `${apiBaseUrl}/book-wish/user/me`,
                method: 'GET',
            }),
            providesTags: ['WishList'],
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
    useAddBookCopyToWishListMutation,
    useGetMyWishListQuery,
} = booksApi;