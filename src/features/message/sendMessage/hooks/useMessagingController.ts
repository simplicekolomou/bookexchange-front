import { useGetMyChatsQuery } from "../../api/messageApi.ts";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import type { Chat } from "../../types/message.types";
import {
    addActiveChat,
    removeActiveChat,
    setActiveTab,
    openChatBox,
    closeChatBox,
    openSendMessageBox,
    closeSendMessageBox,
    selectActiveChats,
    selectActiveTab,
    selectIsChatBoxOpen,
    selectIsSendMessageBoxOpen,
} from "../../messageSlice.ts";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const dispatch = useDispatch();
    const activeChats = useSelector(selectActiveChats);
    const activeTab = useSelector(selectActiveTab);
    const isChatBoxOpen = useSelector(selectIsChatBoxOpen);
    const isSendMessageBoxOpen = useSelector(selectIsSendMessageBoxOpen);

    const {
        data: rawChats = [],
        isLoading: isChatLoading,
        isError: isChatError,
    } = useGetMyChatsQuery();

    const chats: Chat[] = Array.isArray(rawChats) ? rawChats.filter(Boolean) as Chat[] : [];

    const { t } = useTranslation("notification");

    const show =
        "Notification" in window &&
        Notification.permission !== "granted" &&
        Notification.permission !== "denied";

    // Ouvre une chatbox, max 3, pas de doublon
    const openChat = (chat?: Chat | null) => {
        if (!chat) return;
        if (activeChats.length >= MAX_CHATS) return;
        dispatch(addActiveChat(chat));
    };

    // Ferme une chatbox par id
    const closeChat = (chatId: string) => {
        dispatch(removeActiveChat(chatId));
    };

    // Au clic sur un onglet
    const handleTabChange = (newValue: string) => {
        dispatch(setActiveTab(newValue));
        if (newValue === 'groups') dispatch(openChatBox());
        if (newValue === 'sendMessage') dispatch(openSendMessageBox());
    };

    // À la fermeture des boîtes
    const handleCloseChatBox = () => {
        dispatch(closeChatBox());
    };

    const handleCloseSendMessageBox = () => {
        dispatch(closeSendMessageBox());
    };

    return {
        chats,
        isChatLoading,
        isChatError,
        activeChats,
        openChat,
        closeChat,
        value: activeTab,
        setValue: (tab: string) => dispatch(setActiveTab(tab)),
        show,
        open,
        t,
        handleTabChange,
        isChatBoxOpen,
        handleCloseChatBox,
        isSendMessageBoxOpen,
        handleCloseSendMessageBox,
    };
};