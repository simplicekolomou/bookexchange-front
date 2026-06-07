import { useGetGroupChatsQuery } from "../../api/messageApi.ts";
import { useState } from "react";
import type { GroupChat } from "../../types/message.types.ts";
import { useTranslation } from "react-i18next";
import { subscribeToPush } from "../../../../utils/notification.ts";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const {
        data: groupChats = [],
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useGetGroupChatsQuery();

    const [activeChats, setActiveChats] = useState<GroupChat[]>([]);
    const [value, setValue] = useState("messages");
    const [open, setOpen] = useState(true);
    const { t } = useTranslation("notification");

    const show =
        "Notification" in window &&
        Notification.permission !== "granted" &&
        Notification.permission !== "denied";

    // Ouvre une chatbox, max 3, pas de doublon
    const openChat = (group: GroupChat) => {
        setActiveChats((prev) => {
            if (prev.some((g) => g.id === group.id)) return prev; // déjà ouverte
            if (prev.length >= MAX_CHATS) return prev;            // limite atteinte
            return [...prev, group];
        });
    };

    // Ferme une chatbox par id
    const closeChat = (groupId: string) => {
        setActiveChats((prev) => prev.filter((g) => g.id !== groupId));
    };

    // Gestion de la souscription push
    const handleSubscribeToPush = async () => {
        setOpen(false);
        await subscribeToPush();
    };

    return {
        groupChats,
        isGroupLoading,
        isGroupError,
        activeChats,
        openChat,
        closeChat,
        value,
        setValue,
        show,
        open,
        handleSubscribeToPush,
        t,
    };
};