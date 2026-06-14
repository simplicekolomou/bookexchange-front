import React, { useContext } from 'react';
import type {WebSocketContextType} from "../types/websocket.types.ts";

export const WebSocketContext = React.createContext<WebSocketContextType | null>(null);

export const useWebSocket = (): WebSocketContextType => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useWebSocketController must be used within a WebSocketProvider');
    }
    return context;
};