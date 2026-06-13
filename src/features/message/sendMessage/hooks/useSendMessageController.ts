import { useEffect, useRef, useState } from "react";
import { useGetMessagesByGroupChatQuery } from "../../api/messageApi.ts";
import type { GroupChat, Message } from "../../types/message.types.ts";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice.ts";
import { useGetUserQuery } from "../../../auth/api/authApi.ts";
import { useWebSocket } from "../../websocket/hooks/useWebSocket.ts";

interface Props {
    chatGroup?: GroupChat | null;
    open?: boolean;
}

// message étendu pour inclure tempId côté client
type LocalMessage = Message & { tempId?: string };

export const useSendMessageController = ({ chatGroup, open }: Props) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const { sendToDestination, subscribe } = useWebSocket();

    const currentUser = useSelector(selectCurrentUser);
    const myId = currentUser?.id;
    const chatId = chatGroup?.id;

    const { data: initialMessages } = useGetMessagesByGroupChatQuery(chatId!, {
        skip: !chatId,
    });

    useEffect(() => {
        if (initialMessages) {
            setMessages(initialMessages as LocalMessage[]);
        }
    }, [initialMessages]);

    useEffect(() => {
        if (!chatId) return;
        const topic = `/topic/chat/${chatId}`;
        const subscription = subscribe?.(topic, (stompMessage) => {
            try {
                const data: Message = JSON.parse(stompMessage.body);

                if (data.groupChatId !== chatId) return;

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

                    // sinon ajouter
                    return [...prev, data as LocalMessage];
                });
            } catch (error) {
                console.error("Erreur lors du parsing du message STOMP", error);
            }
        });
        return () => subscription?.unsubscribe();
    }, [chatId, subscribe]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !chatGroup) return;

        const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

        const newMessage: LocalMessage = {
            content: text.trim(),
            senderId: myId!,
            sendTime: new Date(),
            groupChatId: chatGroup.id,
            tempId,
        } as LocalMessage;

        // Ajout optimiste avec tempId
        setMessages(prev => [...prev, newMessage]);
        setMessage("");

        // Envoi STOMP vers backend
        sendToDestination?.(`/app/chat/${chatGroup.id}`, JSON.stringify({
            content: text.trim(),
            groupChatId: chatGroup.id,
            // si le backend peut transmettre un clientId, on pourrait envoyer tempId ici
            // clientTempId: tempId
        }));
    };

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const otherMember = chatGroup?.members.find(m => m.endUserId !== myId);
    const otherUserId = otherMember?.endUserId;
    const { data: otherUser } = useGetUserQuery(
        { userId: otherUserId },
        { skip: !otherUserId }
    );
    const conversationName = (() => {
        if (!chatGroup) return "";
        if (chatGroup.groupType === "GROUP") return chatGroup.name ?? "Groupe";
        return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : chatGroup.name ?? "Chat";
    })();
    const isDirect = chatGroup?.groupType === "DIRECT";

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