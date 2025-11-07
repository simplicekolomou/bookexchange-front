export type BookCondition = 'neuf' | 'excellent' | 'bon' | 'acceptable' | 'usé';
export type BookAvailability = 'échanger' | 'vendre' | 'donner' | 'none';

export interface Book {
    id: string;
    userId: string;
    title: string;
    author: string;
    isbn?: string;
    condition: BookCondition;
    format?: string;
    edition?: string;
    coverImage?: string; // Image from API
    userCoverImage?: string; // Image from user
    description?: string;
    availability: BookAvailability
}

export interface Wishlist {
    id: string;
    userId: string;
    title: string;
    author: string;
    createdAt: string;
}
