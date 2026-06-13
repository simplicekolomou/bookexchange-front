import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { IMessage } from "@stomp/stompjs";
import { useWebSocket } from "../../../websocket/hooks/useWebSocket.ts";
import { selectCurrentUser } from "../../../../auth/authSlice.ts";
import {notificationAdded, notificationsCleared,
    notificationsMarkedReadForChat, selectNotifications, selectNotificationsCount} from "../../../messageSlice.ts";

export const useNotification = () => {
    const dispatch = useDispatch();
    const { subscribe, status } = useWebSocket();
    const user = useSelector(selectCurrentUser);
    const notifications = useSelector(selectNotifications);
    const notificationsCount = useSelector(selectNotificationsCount);

    useEffect(() => {
        if (status !== "OPEN" || !user?.email) return;

        const sub = subscribe(
            `/user/queue/notifications`,
            (message: IMessage) => {
                try {
                    const payload = JSON.parse(message.body);
                    if (!payload) return;

                    dispatch(notificationAdded({
                        chatId: String(payload.chatId ?? ""),
                        chatName: payload.chatName,
                        senderName: payload.senderName,
                        content: payload.content,
                        sendTime: payload.sendTime ?? new Date().toISOString(),
                    }));
                } catch (err) {
                    console.error("Erreur parsing notification WS:", err);
                }
            }
        );

        return () => sub?.unsubscribe?.();
    }, [status, user?.email, subscribe, dispatch]);

    return {
        notifications,
        notificationsCount,
        clearAll: () => dispatch(notificationsCleared()),
        markReadFor: (chatId: string) => dispatch(notificationsMarkedReadForChat(chatId)),
    };
};