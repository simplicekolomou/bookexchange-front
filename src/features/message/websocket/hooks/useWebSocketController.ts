import React from 'react';
import {WebSocketContext} from "../provider/websocketContext.ts";

export const useWebSocketController = () => {
    const context = React.useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocketController doit être utilisé à l'intérieur d'un WebSocketProvider");
    }
    return context;
};