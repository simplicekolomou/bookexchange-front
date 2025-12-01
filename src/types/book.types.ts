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
    { value: 'neuf', label: 'Neuf' },
    { value: 'bon', label: 'Bon état' },
    { value: 'mauvais', label: 'Mauvais état' },
    { value: 'acceptable', label: 'Acceptable' }
]

export const Availability = [
    { value: 'echanger', label: 'A échanger' },
    { value: 'vendre', label: 'A vendre' },
    { value: 'donner', label: 'A donner' },
    { value: 'indisponible', label: 'Indisponible' }
]

export interface UserBooksState {
    books: BookTypes[];
    wishlist: WishlistItem[];
    exchanges: Exchange[];
    averageRatings: number;
}

export type author = {
    name : string;
}

// src/types/books.ts
export type VolumeShort = {
    id: string;
    title: string;
    publishedDate: string;
    coverUrl: string;
    isbns: isbns[];
    authors: author[];
    description: string;
};

export type isbns = {
    type: string;
    identifier: string;
}