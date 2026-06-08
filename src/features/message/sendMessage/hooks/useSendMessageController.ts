import { useEffect, useRef, useState } from "react";
import {
    useGetMessagesByGroupChatQuery,
    useSendMessageMutation,
} from "../../api/messageApi.ts";
import type { GroupChat } from "../../types/message.types.ts";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice.ts";
import {useGetUserQuery} from "../../../auth/api/authApi.ts";

interface Props {
    chatGroup?: GroupChat | null;
    open?: boolean;
}

export const useSendMessageController = ({ chatGroup, open }: Props) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");

    const currentUser = useSelector(selectCurrentUser);
    const myId = currentUser?.id;
    const chatId = chatGroup?.id;

    const { data: messages } = useGetMessagesByGroupChatQuery(chatId!, {
        skip: !chatId,
    });

    const [sendMessage] = useSendMessageMutation();

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    const handleSendMessage = async (text: string) => {
        if (!text.trim() || !chatGroup) return;
        try {
            await sendMessage({
                groupChatId: chatGroup.id,
                content: text.trim(),
            }).unwrap();
            setMessage("");
        } catch{ /* empty */ }
    };

    // Dérive le nom affiché selon le type de conversation
    // Pour un DIRECT : récupérer l'id de l'autre membre et appeler le hook au niveau supérieur
    const otherMember = chatGroup?.members.find(m => m.endUserId !== myId);
    const otherUserId = otherMember?.endUserId;

    // Ensuite, fetch l'autre utilisateur
    const { data: otherUser } = useGetUserQuery(
        { userId: otherUserId },
        { skip: !otherUserId }
    );

        const conversationName = (() => {
            if (!chatGroup) return "";
            if (chatGroup.groupType === "GROUP") return chatGroup.name ?? "Groupe";
            return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : chatGroup.name ?? "Chat";
        })();

    // indique si c'est un groupe ou un direct (utile pour la vue)
    const isDirect = chatGroup?.groupType === "DIRECT";

    return {
        messages,
        myId,
        message,
        setMessage,
        handleSendMessage,
        bottomRef,
        conversationName, //nom dérivé selon le type
        isDirect,         //pour adapter l'UI si besoin
    };
};