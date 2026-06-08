import { useGetGroupChatsQuery } from "../../api/messageApi.ts";
import { useState } from "react";
import { subscribeToPush } from "../../../../utils/notification.ts";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../auth/authSlice.ts";
import { useTranslation } from "react-i18next";
import type { GroupChat } from "../../types/message.types";

const MAX_CHATS = 3;

export const useMessagingController = () => {
    const {
        data: rawGroupChats = [],
        isLoading: isGroupLoading,
        isError: isGroupError,
    } = useGetGroupChatsQuery();

    // sanitize les résultats API pour éviter valeurs null
    const groupChats: GroupChat[] = Array.isArray(rawGroupChats) ? rawGroupChats.filter(Boolean) as GroupChat[] : [];

    const [activeChats, setActiveChats] = useState<GroupChat[]>([]);
    const [value, setValue] = useState("messages");
    const [open, setOpen] = useState(true);
    const { t } = useTranslation("notification");

    const currentUserId = useSelector(selectCurrentUserId);

    const isMemberCurrentUser = (conversation: GroupChat) =>
        (conversation?.members ?? []).some((m) => {
            const memberId = typeof m === "object" && m !== null && "id" in m
                ? (m as { id?: string | number }).id
                : m;
            return Number(memberId) === Number(currentUserId);
        });

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

    // Ferme une chatbox par id - accepte id undefined/null
    const closeChat = (groupId?: string | number | null) => {
        const idStr = String(groupId ?? "");
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
        value,
        setValue,
        show,
        open,
        handleSubscribeToPush,
        t,
        isMemberCurrentUser,
        currentUserId,
    };
};
