import { useGetMyGroupChatsQuery } from "../../api/messageApi.ts";
import { useState } from "react";
import { subscribeToPush } from "../../../../utils/notification.ts";
import { useTranslation } from "react-i18next";
import type { GroupChat } from "../../types/message.types";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const {
        data: rawGroupChats = [],
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useGetMyGroupChatsQuery();

    console.log("Réponse du back pour le groupe : ", rawGroupChats);

    // Convertir les résultats API pour éviter valeurs null
    const groupChats: GroupChat[] = Array.isArray(rawGroupChats) ? rawGroupChats.filter(Boolean) as GroupChat[] : [];

    const [activeChats, setActiveChats] = useState<GroupChat[]>([]);
    const [activeButton, setActiveButton] = useState("messages");
    const [open, setOpen] = useState(true);
    const { t } = useTranslation("notification");

    const show =
        "Notification" in window &&
        Notification.permission !== "granted" &&
        Notification.permission !== "denied";

    // Ouvre une chatbox, max 3, pas de doublon - protège valeurs null
    const openChat = (group?: GroupChat | null) => {
        if (!group) return;
        setActiveChats((prev) => {
            const prevSafe = prev.filter(Boolean);
            if (prevSafe.some((g) => String(g?.id) === String(group?.id))) return prevSafe;
            if (prevSafe.length >= MAX_CHATS) return prevSafe;
            return [...prevSafe, group];
        });
    };

    // Ferme une chatbox par id - nécessite un id non null/undefined
    const closeChat = (groupId: string) => {
        const idStr = String(groupId);
        setActiveChats((prev) => prev.filter((g) => String(g?.id ?? "") !== idStr));
    };

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
        value: activeButton,
        setValue: setActiveButton,
        show,
        open,
        handleSubscribeToPush,
        t,
    };
};
