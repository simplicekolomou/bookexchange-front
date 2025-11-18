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

export const bookStates = [
    { label: "Neuf", value: "neuf" },
    { label: "Excellent", value: "excellent" },
    { label: "Bon", value: "bon" },
    { label: "Acceptable", value: "acceptable" },
    { label: "Usé", value: "usé" },
];

export const availabilityOptions = [
    { label: "À échanger", value: "échanger" },
    { label: "À vendre", value: "vendre" },
    { label: "À donner", value: "donner" },
];
