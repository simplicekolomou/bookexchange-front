import type {UserProfile} from "./profile.types.ts";

export interface MessageDTO {
    id: string;
    content: string;
    sendTime: Date;
    sender: UserProfile;
    groupChatId: string;
    read: UserProfile[]; // Tableau des utilisateurs qui ont lu le message
    metadata?: MessageMetadata;
}

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

export interface GroupChatDTO {
    id: string;
    members: MembershipDTO[];
    messages?: MessageDTO[]; // Les du groupe de discussion (paginés si nécessaire)
}

export interface MembershipDTO {
    id: string;
    notification: boolean;
    user: UserProfile;
    groupChatId: string;
}

export interface GroupChat {
    id: string;
    name: string;
    members: UserProfile[];
    myMembership: MembershipDTO;
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
    sender: UserProfile;
    isReadByMe: boolean;
    readByIds: string[]; // IDs des utilisateurs qui ont lu le message
    metadata?: MessageMetadata;
}

export function mapGroupChat(
    dto: GroupChatDTO,
    meId: string
): GroupChat {
    const myMembership = dto.members.find(
        m => m.user.id === meId
    )!;

    const members = dto.members.map(m => m.user);
    const others = members.filter(u => u.id !== meId);

    return {
        id: dto.id,
        name:
            others.length === 1
                ? `${others[0].firstName} ${others[0].lastName}`
                : `Groupe (${members.length})`,
        members,
        myMembership,
        notificationsEnabled: myMembership.notification,
        lastMessage: dto.messages && dto.messages.length > 0
            ? mapMessage(dto.messages[dto.messages.length - 1], meId)
            : null
    };
}

export function mapMessage(
    dto: MessageDTO,
    meId: string
): Message {
    return {
        id: dto.id,
        content: dto.content,
        sendTime: new Date(dto.sendTime),
        sender: dto.sender,
        isReadByMe: dto.read.some(u => u.id === meId),
        readByIds: dto.read.map(u => u.id),
        metadata: dto.metadata
    };
}

export type SendMessageCommand =
    | { type: "TO_CHAT"; chatId: string; content: string }
    | { type: "TO_USER"; userId: string; content: string };

// Événements WebSocket
export const WS_EVENTS = {
    // Événements d'envoi
    SEND_MESSAGE: 'message:send',
    MESSAGE_READ: 'message:read',

    // Événements de réception
    MESSAGE_RECEIVED: 'message:received',
    MESSAGE_READ_RECEIPT: 'message:read_receipt',
    MESSAGE_DELETED: 'message:deleted',
} as const;

export type WSEvent = typeof WS_EVENTS[keyof typeof WS_EVENTS];

export interface WebSocketMessage<T> {
    event: WSEvent;
    data: T;
    timestamp: string;
    requestId?: string; // Pour matcher les réponses aux requêtes
}




