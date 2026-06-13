import React, {
    useEffect, useRef, useState,
    useCallback, useMemo
} from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import type { WebSocketStatus } from '../types/websocket.types';
import { WebSocketContext, type WebSocketContextType } from "./websocketContext.ts";

interface WebSocketProviderProps {
    url: string | null;
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
    const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
    const [lastMessage, setLastMessage] = useState<IMessage | null>(null);
    const clientRef = useRef<Client | null>(null);

    const sendToDestination = useCallback((
        destination: string,
        body: string,
        headers?: Record<string, string>
    ) => {
        const client = clientRef.current;
        if (client?.connected) {
            client.publish({ destination, body, headers: headers as never });
        } else {
            console.warn('STOMP client not connected, message not sent');
        }
    }, []);

    const sendMessage = useCallback((body: string) => {
        sendToDestination('/app/send', body);
    }, [sendToDestination]);

    const subscribe = useCallback((
        destination: string,
        callback: (message: IMessage) => void
    ) => {
        const client = clientRef.current;
        if (client?.connected) {
            return client.subscribe(destination, callback);
        }
        return null;
    }, []);

    useEffect(() => {
        if (!url) {
            clientRef.current?.deactivate();
            clientRef.current = null;
            setStatus('CLOSED');
            setLastMessage(null);
            return;
        }

        const client = new Client({
            brokerURL: url, // URL propre — ws://localhost:8080/ws

            // Le cookie httpOnly est envoyé automatiquement lors du handshake WebSocket
            connectHeaders: {},

            // withCredentials pour que le navigateur envoie le cookie sur le handshake
            webSocketFactory: () => {
                const ws = new WebSocket(url);
                // Note : withCredentials n'existe pas sur WebSocket natif
                // Le cookie est envoyé automatiquement si same-origin ou CORS configuré
                return ws;
            },

            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,

            onConnect: () => {
                console.log('STOMP connected');
                setStatus('OPEN');
            },
            onDisconnect: () => {
                console.log('STOMP disconnected');
                setStatus('CLOSED');
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame.headers['message'], frame.body);
                setStatus('CLOSED');
            },
            onWebSocketError: (event) => {
                console.error('WebSocket error:', event);
                setStatus('CLOSED');
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            clientRef.current?.deactivate();
            clientRef.current = null;
        };
    }, [url]);

    const value = useMemo<WebSocketContextType>(() => ({
        status,
        sendMessage,
        lastMessage,
        sendToDestination,
        subscribe,
    }), [status, sendMessage, lastMessage, sendToDestination, subscribe]);

    return (
        <WebSocketContext.Provider value={value}>
            {children}
        </WebSocketContext.Provider>
    );
};