import { useEffect, useState } from "react";
import {
    useAddGroupChatMutation,
    useLazyFindGroupByMembersQuery,
} from "../../api/messageApi";
import type { AddGroupRequest, GroupChat } from "../../types/message.types";
import {
    useGetMeQuery,
    useGetUserQuery,
} from "../../../auth/api/authApi";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { UserProfile } from "../../../auth/profile/types/profile.types";
import {useSearchPaginatedUsersController} from "./useSearchPaginatedUsersController.ts";

interface Props {
    onGroupSelected?: (group: GroupChat) => void;
    onClose?: () => void;
}

export const useCreateDirectChatController = ({ onGroupSelected, onClose }: Props) => {
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
    const [addGroup] = useAddGroupChatMutation();
    const [triggerFindGroup] = useLazyFindGroupByMembersQuery();

    const handleAddDirectGroup = async (user: UserProfile) => {
        setLocalError(null);
        try {
            // Vérifier existence
            try {
                const existingGroup = await triggerFindGroup(Number(user.id)).unwrap();
                onGroupSelected?.(existingGroup);
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
            const newGroup: AddGroupRequest = {
                groupType: "DIRECT",
                name: null,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) },
                ],
            };
            const result = await addGroup(newGroup).unwrap();
            onGroupSelected?.(result);
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
            await handleAddDirectGroup(targetUser);
        })();
    }, [userId, targetUser]);

    return {
        users,
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick: handleAddDirectGroup,
        searchTerm,
        setSearchTerm,
        isSearching,
    };
};