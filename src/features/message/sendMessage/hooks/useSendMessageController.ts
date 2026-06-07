import { useEffect, useRef, useState } from "react";
import {
    useGetMessagesByGroupChatQuery,
    useSendMessageMutation,
} from "../../api/messageApi.ts";
import type { GroupChat } from "../../types/message.types.ts";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../../auth/authSlice.ts";

interface Props {
    chatGroup?: GroupChat | null;
    open?: boolean;
}

export const useSendMessageController = ({ chatGroup, open }: Props) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const [message, setMessage] = useState("");

    const myId = useSelector(selectCurrentUser)?.id;
    const chatId = chatGroup?.id;

    const { data: messages } = useGetMessagesByGroupChatQuery(chatId!, {
        skip: !chatId,
    });

    const [sendMessage] = useSendMessageMutation();

    // ✅ scroll automatique à chaque nouveau message
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
        } catch (error) {
            console.error(error);
        }
    };

    return {
        messages,
        myId,
        message,
        setMessage,
        handleSendMessage,
        bottomRef,
    };
};