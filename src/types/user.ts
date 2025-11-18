export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    location?: string;
    bio?: string;
    avatar?: string;
    isPrivate: boolean;
    createdAt: string;
}

export interface Exchange {
    id: string;
    userId: string;
    bookTitle: string;
    bookAuthor: string;
    exchangeWith: string;
    exchangeWithName: string;
    date: string;
    type: 'échanger' | 'vendre' | 'donner';
}

export interface Rating {
    id: string;
    fromUserId: string;
    fromUserName: string;
    toUserId: string;
    stars: number;
    comment: string;
    date: string;
}

export interface BlockedUser {
    id: string;
    userId: string;
    blockedUserId: string;
    date: string;
}
