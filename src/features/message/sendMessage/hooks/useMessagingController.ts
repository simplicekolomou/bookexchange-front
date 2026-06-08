import { useGetMyGroupChatsQuery } from "../../api/messageApi.ts";
import { useState } from "react";
import { subscribeToPush } from "../../../../utils/notification.ts";
import { useTranslation } from "react-i18next";
import type { GroupChat } from "../../types/message.types";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const [isGroupBoxOpen, setIsGroupBoxOpen] = useState(false);
    const [isSendMessageBoxOpen, setIsSendMessageBoxOpen] = useState(false);

    const {
        data: rawGroupChats = [],
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useGetMyGroupChatsQuery();

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

    // Au clic sur un onglet :
    const handleTabChange = (newValue: string) => {
        setActiveButton(newValue);
        // Ouvre la boîte correspondante si on clique sur l'onglet (même s'il était déjà actif)
        if (newValue === 'groups') setIsGroupBoxOpen(true);
        if (newValue === 'sendMessage') setIsSendMessageBoxOpen(true);
    };

    // À la fermeture des boîtes :
    const closeGroupBox = () => {
        setIsGroupBoxOpen(false);
    };
    const closeSendMessageBox = () => {
        setIsSendMessageBoxOpen(false);
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
        handleTabChange,
        isGroupBoxOpen,
        closeGroupBox,
        isSendMessageBoxOpen,
        closeSendMessageBox,
    };
};
