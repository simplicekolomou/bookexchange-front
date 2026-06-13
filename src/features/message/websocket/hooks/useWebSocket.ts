import React from 'react';
import {WebSocketContext} from "../provider/websocketContext.ts";

export const useWebSocket = () => {
    const context = React.useContext(WebSocketContext);
    if (!context) {
        throw new Error("useWebSocket doit être utilisé à l'intérieur d'un WebSocketProvider");
    }
    return context;
};