import { useEffect, useRef, useState } from "react";
import type { Chat, Message } from "../../types/message.types.ts";
import {useDispatch, useSelector} from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice.ts";
import { useGetUserQuery } from "../../../auth/api/authApi.ts";
import { useWebSocketController } from "../../websocket/hooks/useWebSocketController.ts";
import {useGetMessagesByChatQuery} from "../../api/messageApi.ts";
import {baseApi} from "../../../../services/baseApi.ts";

interface Props {
    chat?: Chat | null;
    open?: boolean;
}

// message étendu pour inclure tempId côté client
type LocalMessage = Message & { tempId?: string };

export const useSendMessageController = ({ chat, open }: Props) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const { sendToDestination, subscribe } = useWebSocketController();
    const dispatch = useDispatch();

    const currentUser = useSelector(selectCurrentUser);
    const myId = currentUser?.id;
    const chatId = chat?.id;

    const { data: initialMessages } = useGetMessagesByChatQuery(chatId!, {
        skip: !chatId,
    });

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages as LocalMessage[]);
        }
    }, [initialMessages]);

    useEffect(() => {
        if (!chatId) return;
        const topic = `/topic/messages/chats/${chatId}`;
        const subscription = subscribe?.(topic, (stompMessage) => {
            try {
                const data = JSON.parse(stompMessage.body);

                if (data.chatId !== chatId) return;

                setMessages(prev => {
                    // si le message du serveur existe déjà (même id), ne rien faire
                    if (prev.some(m => m.id === data.id)) return prev;

                    // tenter de trouver un message optimiste correspondant (pas d'id, même content + senderId)
                    const tempIdx = prev.findIndex(m =>
                        !m.id &&
                        m.content === data.content &&
                        m.senderId === data.senderId
                    );

                    if (tempIdx !== -1) {
                        // remplacer l'optimistic message par la version serveur (avec id)
                        const next = [...prev];
                        next[tempIdx] = data as LocalMessage;
                        return next;
                    }

                    // sinon, c'est un nouveau message, on l'ajoute et on invalide le compteur de non-lus
                    const chatId = data.chatId;
                    dispatch(baseApi.util.invalidateTags([{ type: 'UnreadCount', id: chatId }]));

                    // sinon ajouter
                    return [...prev, data as LocalMessage];
                });
            } catch (error) {
                console.error("Erreur lors du parsing du message STOMP", error);
            }
        });

        return () => {
            subscription?.unsubscribe();
        }
    }, [chatId, subscribe]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !chat) return;

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const newMessage: LocalMessage = {
            content: text.trim(),
            senderId: myId!,
            sendTime: new Date(),
            chatId: chat.id,
            tempId,
        } as LocalMessage;
        // Ajout optimiste avec tempId
        setMessages(prev => [...prev, newMessage]);
        setMessage("");

        // Envoi STOMP vers backend
        sendToDestination?.(`/app/chats/${chat.id}`, JSON.stringify({
            content: text.trim(),
            chatId: chat.id,
        }));
    };

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const otherMember = chat?.members.find(m => m.endUserId !== myId);
    const otherUserId = otherMember?.endUserId;
    const { data: otherUser } = useGetUserQuery(
        { userId: otherUserId },
        { skip: !otherUserId }
    );
    const conversationName = (() => {
        if (!chat) return "";
        if (chat.chatType === "GROUP") return chat.name ?? "Groupe";
        return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : chat.name ?? "Chat";
    })();
    const isDirect = chat?.chatType === "DIRECT";

    return {
        messages,
        myId,
        message,
        setMessage,
        handleSendMessage,
        bottomRef,
        conversationName,
        isDirect,
    };
};