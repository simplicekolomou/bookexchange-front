import { useGetMyChatsQuery } from "../../api/messageApi.ts";
import { useDispatch, useSelector } from "react-redux";
import { subscribeToPush } from "../../../../utils/notification.ts";
import { useTranslation } from "react-i18next";
import type { Chat } from "../../types/message.types";
import {
    addActiveChat,
    removeActiveChat,
    setActiveTab,
    openGroupBox,
    closeGroupBox,
    openSendMessageBox,
    closeSendMessageBox,
    selectActiveChats,
    selectActiveTab,
    selectIsGroupBoxOpen,
    selectIsSendMessageBoxOpen,
} from "../../messageSlice.ts";
import {useState} from "react";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const dispatch = useDispatch();
    const activeChats = useSelector(selectActiveChats);
    const activeTab = useSelector(selectActiveTab);
    const isGroupBoxOpen = useSelector(selectIsGroupBoxOpen);
    const isSendMessageBoxOpen = useSelector(selectIsSendMessageBoxOpen);

    const {
        data: rawGroupChats = [],
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useGetMyChatsQuery();

    const groupChats: Chat[] = Array.isArray(rawGroupChats) ? rawGroupChats.filter(Boolean) as Chat[] : [];

    const [open, setOpen] = useState(true);
    const { t } = useTranslation("notification");

    const show =
        "Notification" in window &&
        Notification.permission !== "granted" &&
        Notification.permission !== "denied";

    // Ouvre une chatbox, max 3, pas de doublon
    const openChat = (group?: Chat | null) => {
        if (!group) return;
        if (activeChats.length >= MAX_CHATS) return;
        dispatch(addActiveChat(group));
    };

    // Ferme une chatbox par id
    const closeChat = (groupId: string) => {
        dispatch(removeActiveChat(groupId));
    };

    const handleSubscribeToPush = async () => {
        setOpen(false);
        await subscribeToPush();
    };

    // Au clic sur un onglet
    const handleTabChange = (newValue: string) => {
        dispatch(setActiveTab(newValue));
        if (newValue === 'groups') dispatch(openGroupBox());
        if (newValue === 'sendMessage') dispatch(openSendMessageBox());
    };

    // À la fermeture des boîtes
    const handleCloseGroupBox = () => {
        dispatch(closeGroupBox());
    };

    const handleCloseSendMessageBox = () => {
        dispatch(closeSendMessageBox());
    };

    return {
        groupChats,
        isGroupLoading,
        isGroupError,
        activeChats,
        openChat,
        closeChat,
        value: activeTab,
        setValue: (tab: string) => dispatch(setActiveTab(tab)), // si besoin d’un setter direct
        show,
        open,
        handleSubscribeToPush,
        t,
        handleTabChange,
        isGroupBoxOpen,
        closeGroupBox: handleCloseGroupBox,
        isSendMessageBoxOpen,
        closeSendMessageBox: handleCloseSendMessageBox,
    };
};