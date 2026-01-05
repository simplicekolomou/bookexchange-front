import type {UserProfile} from "./profile.types.ts";

export interface MessageMetadata {
    bookId?: string;
    bookTitle?: string;
    bookAuthor?: string;
    transactionType?: 'échanger' | 'vendre' | 'donner';
    attachments?: Attachment[];
}

export interface Attachment {
    id: string;
    type: 'image';
    url: string;
    name: string;
    size: number;
    mimeType: string;
    thumbnailUrl?: string;
}

export interface GroupChat {
    id: string;
    name: string;
    members: UserProfile[];
    myMembership: Membership[];
    notificationsEnabled: boolean;
    lastMessage: Message | null;
}

export interface PagedResponse<T> {
    content: T[];
    last?: boolean;
    totalPages?: number;
}

export interface Message {
    id: string;
    content: string;
    sendTime: Date;
    senderId: string;
    isReadByMe: boolean;
    readByIds: string[]; // IDs des utilisateurs qui ont lu le message
    metadata?: MessageMetadata;
}

export interface Membership {
    userId: string;
    groupId: string;
    notification: boolean;
}



