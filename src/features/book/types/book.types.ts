export interface BookCopy {
    id: string;
    physicalState: string;
    availabilityType: string //   NONE, FOR_SALE, FOR_TRADE,  FOR_GIFT'
    askingPrice: number;
    title: string;
    authors: string[];
    format: string;
    edition: string;
    isbn: string;
    coverPictureApiUrl: string | undefined;
    userUploadPicturePath: string;
    description: string;
    ownerId: number;
}

export interface WishlistItem {
    id: string;
    title: string;
    author: string;
}

export interface Exchange {
    id: string;
    userIdSource: string;
    userIdDestination: string;
    status: string;
}

/**
 * Valeur servant au formulaire d'ajout de livre.
 * Est en accord avec le backend -> NE PAS MODIFIER LES VALEURS
 * Ou le faire en modifiant les enums correspondantes dans le backend
 * Et aussi modifier les clés des traductions I18n dans addBook.json
 */
export const BookStateLabel = [
    { value: 'NEW'},
    { value: 'VERY_GOOD'},
    { value: 'GOOD'},
    { value: 'DECENT'}
]

/**
 * Valeur servant au formulaire d'ajout de livre.
 * Est en accord avec le backend -> NE PAS MODIFIER LES VALEURS
 * Ou le faire en modifiant les enums correspondantes dans le backend
 * Et aussi modifier les clés des traductions I18n dans addBook.json
 */
export const Availability = [
    { value: 'FOR_TRADE'},
    { value: 'FOR_SALE'},
    { value: 'FOR_GIFT'},
    { value: 'NONE'}
]

export interface UserBooksState {
    books: BookCopy[];
    wishlist: WishlistItem[];
    exchanges: Exchange[];
    averageRatings: number;
}

// src/types/books.ts
export type VolumeShort = {
    id: string;
    title: string;
    publishedDate: string;
    coverUrl: string;
    isbns: isbns[];
    authors: string[];
    description: string;
};

export type isbns = {
    type: string;
    identifier: string;
}

/**
 * Interface des bouquins de collection du backend
 */
export interface AddBookRequest {
    id?: string;
    physicalState: string;
    availabilityType: string;
    askingPrice: number;
    title: string;
    authors: string[];
    format: string;
    edition: string;
    isbn: string;
    coverPictureApiUrl: string | undefined;
    userUploadPicturePath: string;
    description: string;
}
