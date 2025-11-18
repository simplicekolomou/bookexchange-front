export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    read: boolean;
    type?: 'text';
    metadata?: {
        bookId?: string;
        bookTitle?: string;
        bookAuthor?: string;
        transactionType?: 'échanger' | 'vendre' | 'donner';
    };
}

export interface Conversation {
    id: string;
    participants: string[];
    createdAt: string;
    updatedAt: string;
}
