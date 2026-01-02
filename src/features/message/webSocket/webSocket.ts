import { store } from "../../../app/store";
import type {GroupChat, Message } from "../../../types/message.types";
import { messageApi } from "../messageApi";

type WsEvent =
    | { type: "MESSAGE_CREATED"; payload: { groupChat: GroupChat; message: Message } }
    | { type: "OTHER_EVENT"; payload?: unknown };

class WebSocketService {
    private ws: WebSocket | null = null;

    connect(url: string) {
        if (this.ws) return;

        this.ws = new WebSocket(url);

        this.ws.onopen = () => console.log("WS connected");

        this.ws.onmessage = (event) => {
            const data: WsEvent = JSON.parse(event.data);
            this.handleEvent(data);
        };

        this.ws.onclose = () => {
            console.log("WS disconnected, retrying in 2s");
            this.ws = null;
            setTimeout(() => this.connect(url), 2000);
        };

        this.ws.onerror = (err) => console.error("WS error", err);
    }

    private handleEvent(event: WsEvent) {
        switch (event.type) {
            case "MESSAGE_CREATED": {
                const { groupChat, message } = event.payload;

                // injecter chat si nouveau
                store.dispatch(
                    messageApi.util.updateQueryData("getChats", undefined, (draft: GroupChat[]) => {
                        if (!draft.find((c: GroupChat) => c.id === groupChat.id)) draft.push(groupChat);
                    })
                );

                // injecter message
                store.dispatch(
                    messageApi.util.updateQueryData(
                        "getMessagesByChat",
                        groupChat.id,
                        (draft: Message[] = []) => {
                            draft.push(message);
                        }
                    )
                );
                break;
            }

            default:
                break;
        }
    }

    sendMessage(payload: { groupChatId?: string; toUserId?: string; content: string }) {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error("WS not connected");
            return;
        }

        this.ws.send(JSON.stringify({ type: "SEND_MESSAGE", payload }));
    }
}

export const webSocketService = new WebSocketService();
