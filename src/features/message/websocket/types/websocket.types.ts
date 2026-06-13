import type {IMessage} from '@stomp/stompjs';

export type WebSocketStatus = 'CONNECTING' | 'OPEN' | 'CLOSING' | 'CLOSED';

export interface WebSocketContext {
    status: WebSocketStatus;
    sendMessage: (message: string) => void;
    lastMessage: IMessage | null;
    sendToDestination?: (destination: string, body: string, headers?: any) => void;
    subscribe?: (destination: string, callback: (message: IMessage) => void) => any;
}