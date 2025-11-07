export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt: string;
    read: boolean;
    type?: 'text' | 'proposal';
    metadata?: {
        bookId?: string;
        bookTitle?: string;
        bookAuthor?: string;
        transactionType?: 'échanger' | 'vendre' | 'donner';
    };
}

export interface Conversation {
    id: string;
    participants: string[]; // User IDs
    createdAt: string;
    updatedAt: string;
}
