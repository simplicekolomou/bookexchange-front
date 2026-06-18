import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';
import { WebSocketContext } from './websocketContext.ts';
import type { WebSocketContextType, WebSocketStatus } from '../types/websocket.types.ts';
import SockJS from 'sockjs-client';
import {useGetMeQuery, useGetWebsocketTokenQuery} from "../../../auth/api/authApi.ts";

interface WebSocketProviderProps {
    url: string | null;
    children: React.ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ url, children }) => {
    const [status, setStatus] = useState<WebSocketStatus>('CLOSED');
    const [lastMessage, setLastMessage] = useState<IMessage | null>(null);
    const clientRef = useRef<Client | null>(null);
    const { data: user } = useGetMeQuery();
    const { data: wsToken, isSuccess } = useGetWebsocketTokenQuery(
        undefined, {
            skip: !user,
        }
    );

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

        if(!wsToken || !isSuccess || !user) {
            console.log("Le token WebSocket n'est pas encore disponible ou est en cours de chargement.");
            return;
        }

        console.log("Le token WebSocket est :", wsToken);

        const client = new Client({
            // On utilise webSocketFactory pour SockJS, pas besoin de brokerURL
            // On passe l'option withCredentials: true pour que le navigateur envoie les cookies HttpOnly
            webSocketFactory: () => new SockJS(url),

            // connectHeaders peut rester vide car le cookie sera envoyé automatiquement
            connectHeaders: {
                Authorization: `Bearer ${wsToken.token}`
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
    }, [url, wsToken, user]);

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