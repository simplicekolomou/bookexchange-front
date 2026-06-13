import React, { useContext } from 'react';
import type {IMessage, StompSubscription} from '@stomp/stompjs';
import type {WebSocketStatus} from '../types/websocket.types';

export type WebSocketContextType = {
    status: WebSocketStatus;
    sendMessage: (body: string) => void;
    lastMessage: IMessage | null;
    sendToDestination: (destination: string, body: string, headers?: Record<string, string>) => void;
    subscribe: (destination: string, callback: (message: IMessage) => void) => StompSubscription | null;
};

export const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocket must be used within a WebSocketProvider');
    }
    return context;
};