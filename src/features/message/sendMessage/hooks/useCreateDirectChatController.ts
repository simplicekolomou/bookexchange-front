import { useEffect, useState } from "react";
import {
    useAddChatMutation,
    useLazyFindChatByMembersQuery,
} from "../../api/messageApi";
import type { AddChatRequest, Chat } from "../../types/message.types";
import {
    useGetMeQuery,
    useGetUserQuery,
} from "../../../auth/api/authApi";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { UserProfile } from "../../../auth/profile/types/profile.types";
import {useSearchPaginatedUsersController} from "./useSearchPaginatedUsersController.ts";

interface Props {
    onChatSelected?: (chat: Chat) => void;
    onClose?: () => void;
}

export const useCreateDirectChatController = ({ onChatSelected, onClose }: Props) => {
    const { t } = useTranslation("message");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;

    const { users, isFetching, isLastPage, handleScroll, searchTerm, setSearchTerm, isSearching } =
        useSearchPaginatedUsersController({ size: 15 });
    
    const [localError, setLocalError] = useState<string | null>(null);
    const { data: currentUser } = useGetMeQuery();
    const { data: targetUser } = useGetUserQuery(
        { userId: userId ?? "" },
        { skip: !userId }
    );
    const [addChat] = useAddChatMutation();
    const [triggerFindChat] = useLazyFindChatByMembersQuery();

    const handleAddDirectChat = async (user: UserProfile) => {
        setLocalError(null);
        try {
            // Vérifier existence
            try {
                const existingChat = await triggerFindChat({chatType: "DIRECT", targetUserId: user.id}).unwrap();
                onChatSelected?.(existingChat);
                onClose?.();
                return;
            } catch (error) {
                const status = (error as { status?: number })?.status;
                if (status !== 404) {
                    setLocalError(t("serverError"));
                    return;
                }
            }
            // Création
            const newChat: AddChatRequest = {
                chatType: "DIRECT",
                name: null,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) },
                ],
            };
            const result = await addChat(newChat).unwrap();
            onChatSelected?.(result);
            onClose?.();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    // Ouverture auto si ?user dans l'URL
    useEffect(() => {
        if (!userId || !targetUser) return;
        (async () => {
            await handleAddDirectChat(targetUser);
        })();
    }, [userId, targetUser]);

    return {
        users,
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick: handleAddDirectChat,
        searchTerm,
        setSearchTerm,
        isSearching,
    };
};