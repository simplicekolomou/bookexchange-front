export interface BookTypes {
    id: string;
    apiId: string;
    title: string;
    bookState: string,
    availability: string,
    author: string;
    coverImage: string;
    personalImage?: string;
    isbn?: string;
    description?: string;
}

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
    coverPictureApiUrl: string;
    userUploadPicturePath: string;
    description: string;
    ownerId: string;
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

export const BookStateLabel = [
    { value: 'new'},
    { value: 'very_good'},
    { value: 'good'},
    { value: 'decent'}
]

export const Availability = [
    { value: 'for_trade'},
    { value: 'for_sale'},
    { value: 'for_gift'},
    { value: 'none'}
]

export interface UserBooksState {
    books: BookTypes[];
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
    physicalState: string;
    availabilityType: string;
    askingPrice: number;
    title: string;
    authors: string[];
    format: string;
    edition: string;
    isbn: string;
    coverPictureApiUrl: string;
    userUploadPicturePath: string;
    description: string;
}