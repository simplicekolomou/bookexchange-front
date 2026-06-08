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

export type GroupChatType = 'GROUP' | 'DIRECT';
export interface GroupChat {
    id: string;
    groupType: GroupChatType;
    name: string;
    members: string[] | undefined[];
    myMembership: Membership[];
    notificationsEnabled: boolean;
    lastMessage: Message | null;
}

export interface AddGroupRequest {
    name?: string | null;
    groupType: GroupChatType;
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

export interface MessageState {
    groupChats: GroupChat[];
    currentChat: GroupChat | null;
    messages: Message[];
    isLoading: boolean;
    error: string | null;
}



