import { useState } from "react";
import { useAddGroupChatMutation } from "../../api/messageApi";
import { useTranslation } from "react-i18next";
import type { AddGroupRequest, GroupChat, GroupChatType } from "../../types/message.types";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../auth/authSlice";
import {useSearchPaginatedUsersController} from "./useSearchPaginatedUsersController.ts";

interface Props {
    onClose: () => void;
    onGroupSelected: (group: GroupChat) => void;
}

export const useCreateGroupChatController = ({ onClose, onGroupSelected }: Props) => {
    const { t } = useTranslation("message");
    const currentUserId = useSelector(selectCurrentUserId);

    const { users, isFetching, isLastPage, handleScroll, searchTerm, setSearchTerm, isSearching } =
        useSearchPaginatedUsersController({ size: 15 });

    const [groupName, setGroupName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const [addGroup, { isLoading }] = useAddGroupChatMutation();

    const toggleMember = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleCreateGroupChat = async () => {
        const groupType: GroupChatType = "GROUP";
        setLocalError(null);

        if (!groupName.trim()) {
            setLocalError(t("createGroup.nameRequired"));
            return;
        }
        if (selectedUserIds.length < 2) {
            setLocalError(t("createGroup.minMembers"));
            return;
        }

        try {
            const allMemberIds = [...new Set([currentUserId, ...selectedUserIds])].filter(Boolean);
            const newGroup: AddGroupRequest = {
                name: groupName.trim(),
                groupType,
                members: allMemberIds.map((id) => ({
                    notification: true,
                    endUserId: Number(id),
                })),
            };
            const result = await addGroup(newGroup).unwrap();
            setGroupName("");
            setSelectedUserIds([]);
            onGroupSelected(result);
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
        setGroupName("");
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
        groupName,
        setGroupName,
        selectedUserIds,
        toggleMember,
        handleScroll,
        handleCreateGroup: handleCreateGroupChat,
        handleClose,
        isLoading,
        localError,
        t,
        searchTerm,
        setSearchTerm,
    };
};