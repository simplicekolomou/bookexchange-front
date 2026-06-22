import { useState } from "react";
import { useAddChatMutation } from "../../api/messageApi";
import { useTranslation } from "react-i18next";
import type { AddChatRequest, Chat, ChatType } from "../../types/message.types";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../auth/authSlice";
import {useSearchPaginatedUsersController} from "./useSearchPaginatedUsersController.ts";

interface Props {
    onClose: () => void;
    onChatSelected: (chat: Chat) => void;
}

export const useCreateGroupChatController = ({ onClose, onChatSelected }: Props) => {
    const { t } = useTranslation("message");
    const currentUserId = useSelector(selectCurrentUserId);

    const { users, isFetching, isLastPage, handleScroll, searchTerm, setSearchTerm, isSearching } =
        useSearchPaginatedUsersController({ size: 15 });

    const [chatName, setChatName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const [addChat, { isLoading }] = useAddChatMutation();

    const toggleMember = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreateGroupChat = async () => {
        const chatType: ChatType = "GROUP";
        setLocalError(null);

        if (!chatName.trim()) {
            setLocalError(t("createGroup.nameRequired"));
            return;
        }
        if (selectedUserIds.length < 2) {
            setLocalError(t("createGroup.minMembers"));
            return;
        }

        try {
            const allMemberIds = [...new Set([currentUserId, ...selectedUserIds])].filter(Boolean);
            const newChat: AddChatRequest = {
                name: chatName.trim(),
                chatType: chatType,
                members: allMemberIds.map((id) => ({
                    notification: true,
                    endUserId: Number(id),
                })),
            };
            const result = await addChat(newChat).unwrap();
            setChatName("");
            setSelectedUserIds([]);
            onChatSelected(result);
            onClose();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 409) {
                setLocalError(t("createGroup.directAlreadyExists"));
                return;
            }
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    const handleClose = () => {
        setChatName("");
        setSelectedUserIds([]);
        setLocalError(null);
        setSearchTerm("");
        onClose();
    };

    return {
        users,
        isFetching,
        isLastPage,
        isSearching,
        chatName,
        setChatName,
        selectedUserIds,
        toggleMember,
        handleScroll,
        handleCreateGroupChat,
        handleClose,
        isLoading,
        localError,
        t,
        searchTerm,
        setSearchTerm,
    };
};