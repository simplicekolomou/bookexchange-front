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

export type ChatType = 'GROUP' | 'DIRECT';

export interface Member {
    id: string;
    notification: boolean;
    endUserId: string;
    chatId: string;
}

export interface Chat {
    id: string;
    chatType: ChatType;
    name: string;
    members: Member[];
    myMembership: Membership[];
    notificationsEnabled: boolean;
    lastMessage: Message | null;
    unReadMessagesCount?: number;
    notifications?: NotificationItem[];
}

export interface AddChatRequest {
    name?: string | null;
    chatType: ChatType;
    members: {
        endUserId: number;
        notification: boolean;
    }[];
}

export interface PagedResponse<T> {
    content: T[];
    last?: boolean;
    totalPages?: number;
}

export interface Message {
    id?: string;
    tempId?: string; // pour les messages optimistes côté client
    content: string;
    sendTime: Date;
    senderId: string;
    isReadByMe?: boolean;
    readByIds?: string[]; // IDs des utilisateurs qui ont lu le message
    metadata?: MessageMetadata;
    chatId: string
}

export interface Membership {
    userId: string;
    chatId: string;
    notification: boolean;
}

export interface NotificationItem {
    id: string;
    chatId: string;
    chatName?: string;
    senderId?: string;
    senderName?: string;
    content?: string;
    sendTime: string | Date;
}
export interface MessageState {
    activeChats: Chat[];        // conversations ouvertes (ChatBox)
    activeTab: string;               // 'messages' | 'chats' | 'sendMessage'
    isChatBoxOpen: boolean;
    isSendMessageBoxOpen: boolean;
    notifications: NotificationItem[];
    unreadMessageCount: number; // compteur global de messages non lus
}



