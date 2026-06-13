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

export interface Member {
    id: string;
    notification: boolean;
    endUserId: string;
    groupChatId: string;
}

export interface GroupChat {
    id: string;
    groupType: GroupChatType;
    name: string;
    members: Member[];
    myMembership: Membership[];
    notificationsEnabled: boolean;
    lastMessage: Message | null;
    unReadMessagesCount?: number;
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
    id?: string;
    tempId?: string; // pour les messages optimistes côté client
    content: string;
    sendTime: Date;
    senderId: string;
    isReadByMe?: boolean;
    readByIds?: string[]; // IDs des utilisateurs qui ont lu le message
    metadata?: MessageMetadata;
    groupChatId: string
}

export interface Membership {
    userId: string;
    groupId: string;
    notification: boolean;
}

export interface NotificationItem {
    id: string;             // id généré côté client ou fourni par le serveur
    chatId: string;         // garder le même type que GroupChat.id / Message.groupChatId
    chatName?: string;
    senderId?: string;      // utile pour filter/ignore les notifications de l'expéditeur
    senderName?: string;
    content?: string;
    sendTime: string | Date; // le serveur renvoie probablement une ISO string
    // champs optionnels supplémentaires selon payload serveur
    [key: string]: unknown;
}
export interface MessageState {
    activeChats: GroupChat[];        // conversations ouvertes (ChatBox)
    activeTab: string;               // 'messages' | 'groups' | 'sendMessage'
    isGroupBoxOpen: boolean;
    isSendMessageBoxOpen: boolean;
    notifications: NotificationItem[];
}



