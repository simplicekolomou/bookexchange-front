import type {AddBookRequest, VolumeShort, WishlistItem} from '../types/book.types.ts';
import {baseApi} from "../../../services/baseApi.ts";
import type {BookCopy} from '../types/book.types.ts';
import type {UserProfile} from "../../auth/profile/types/profile.types.ts";
import type {PagedResponse} from "../../message/types/message.types.ts";

export const booksApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getMyBooks: builder.query<BookCopy[], void>({
            query: () => ({
                url: `/book-copies/user/me`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [...result.map((book) =>
                        (
                            // Un tag par livre
                            { type: 'Book' as const, id: book.id })),
                            // Pour resté abonnée aux invalidations glogales du type Book
                            { type: 'Book' as const, id: 'LIST' }]
                    : [
                        // En cas d'échec fournir LIST pour que la query reste abonnée
                        { type: 'Book' as const, id: 'LIST' }
                    ],
        }),

        getBookCopy: builder.query<BookCopy, { copyId: number }>({
            query: ({ copyId }) => ({
                url: `/book-copies/${copyId}`,
                method: 'GET',
            }),
            providesTags: (result, _error, { copyId }) =>
                result
                    // Cas normal : la requête a réussi, on tag avec l'id du livre reçu.
                    // (on pourrait aussi utiliser "copyId" venant des arguments, voir remarque plus bas)
                    ? [{ type: 'Book', id: result.id }]
                    // Cas d'échec/absence de résultat : on tag quand même avec l'id demandé (copyId),
                    // pour que si jamais ce livre est créé/modifié plus tard, le composant
                    // qui a essayé de le charger soit notifié et puisse retenter le fetch.
                    : [{ type: 'Book', id: copyId }],
        }),

        getBookOwner: builder.query<UserProfile, {userId: number}>({
            query: ({ userId }) => ({
                url: `/users/${userId}`,
                method: 'GET',
            }),
            // On tag cette query avec l'id de l'utilisateur demandé.
            // But : si une mutation modifie ce même utilisateur (ex: updateProfile),
            // et qu'elle invalide { type: 'User', id: userId }, alors CETTE query
            // sera automatiquement refetch avec les données à jour.
            providesTags: (result, _error, { userId }) =>
                result
                    ?[{ type: 'User', id: result.id }]
                    : [{ type: 'User', id: userId }],
        }),

        getUserBooks: builder.query<BookCopy[], { userId: number }>({
            query: ({ userId }) => ({
                url: `/book-copies/user/${userId}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [
                        // Un tag par livre : permet d'invalider UN SEUL livre
                        // sans recharger toute la liste (ex: après une modif d'un livre précis)
                        ...result.map((book) => ({
                            type: 'Book' as const, // "as const" fige le type en littéral "Book"
                            id: book.id,
                        })),
                        // Le tag "LIST" : représente la liste dans son ensemble.
                        // C'est CE tag qu'on invalide quand on crée un nouveau livre,
                        // puisqu'on ne connaît pas encore son id à l'avance.
                        { type: 'Book' as const, id: 'LIST' as const },
                    ]
                    : [{ type: 'Book' as const, id: 'LIST' as const }],
        }),

        addBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `/book-copies/user/me`,
                method: 'POST',
                body: bookData,
            }),
            invalidatesTags: [{type: "Book", id: "LIST" }]
        }),

        updateBookCopy: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `/book-copies/user/me`,
                method: 'PUT',
                body: bookData,
            }),
            invalidatesTags: (_result, _error, { id }) =>
                [{ type: 'Book', id }],
        }),

        getBookSuggestions: builder.query<
            VolumeShort[],
            { title?: string; author?: string; lang?: string; limit?: number }
        >({
            query: ({ title, author, lang = 'fre', limit = 10 }) => ({
                url: `/books/search`,
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
                url: `/book-copies/search/book`,
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
            // "result" ici est un PagedResponse<BookCopy>, donc un objet
            // { content: BookCopy[], totalPage: number et last: boolean } et NON un tableau brut.
            // Il faut donc piocher dans result.content pour récupérer la liste des livres.
            providesTags: (result) =>
                (result?.content ?? []).length > 0 || result
                    ? [
                        //    Un tag par livre RETOURNÉ DANS CETTE PAGE.
                        //    Ça permet : si CE livre précis est modifié ailleurs (updateBook),
                        //    seule cette query sera invalidée/refetch, pas toutes les recherches.
                        ...(result?.content ?? []).map((book) => ({ type: 'Book', id: book.id } as const)),
                        { type: 'Book', id: 'LIST' } as const,
                    ]
                    : // Si la query échoue ou n'a pas encore de résultat,
                      // on retourne quand même le tag LIST pour que la query soit
                      // "raccrochée" à la catégorie Book et se refetch si besoin.
                    [{ type: 'Book', id: 'LIST' }],
        }),

        addBookCopyToWishList: builder.mutation<void, AddBookRequest>({
            query: (bookData) => ({
                url: `/book-wish/user/me`,
                method: 'POST',
                body: bookData,
            }),
             invalidatesTags: [{type: 'WishList', id: 'LIST'}],
        }),

        getMyWishList: builder.query<WishlistItem[], void>({
            query: () => ({
                url: `/book-wish/user/me`,
                method: 'GET',
            }),
            providesTags: (result) =>
                        result
                            ? result.map((wish) => ({
                                type: 'WishList' as const,
                                id: wish.id,
                            }))
                            : [{ type: 'WishList', id: 'LIST' }],
        }),
    }),

    // Pour contrôler le comportement lors d'un conflit de noms
    // si tu essaies d'injecter un endpoint qui porte déjà le même
    // nom qu'un endpoint existant, RTK Query lève une erreur et n'écrase pas l'ancien
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