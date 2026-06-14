import type {IMessage, StompSubscription} from '@stomp/stompjs';

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export type WebSocketContextType = {
    status: WebSocketStatus;
    sendMessage: (body: string) => void;
    lastMessage: IMessage | null;
    sendToDestination: (destination: string, body: string, headers?: Record<string, string>) => void;
    subscribe: (destination: string, callback: (message: IMessage) => void) => StompSubscription | null;
};