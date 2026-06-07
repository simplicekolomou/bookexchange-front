import React, { useEffect, useRef, useState } from "react";
import {
    useAddGroupChatMutation,
    useLazyFindGroupByMembersQuery,
} from "../../api/messageApi.ts";
import type { GroupChat, PagedResponse } from "../../types/message.types.ts";
import {
    useGetAllUsersQuery,
    useGetCurrentUserQuery,
    useGetUserQuery,
} from "../../../auth/api/authApi.ts";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";

interface Props {
    onGroupSelected?: (group: GroupChat) => void;
    onClose?: () => void;
}

export const useConversationController = ({ onGroupSelected, onClose }: Props) => {
    const { t } = useTranslation("message");
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;

    const [page, setPage] = useState(0);
    const size = 15;
    const [localUsersForPagination, setLocalUsersForPagination] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const loadingRef = useRef(false);

    const { data: loadedUsers, isFetching } = useGetAllUsersQuery({ page, size });
    const { data: currentUser } = useGetCurrentUserQuery();
    const { data: targetUser } = useGetUserQuery(
        { userId: userId ?? "" },
        { skip: !userId }
    );

    const [addGroup] = useAddGroupChatMutation();
    const [triggerFindGroup] = useLazyFindGroupByMembersQuery();

    // ✅ hydratation de la liste paginée sans doublons
    useEffect(() => {
        if (!loadedUsers) return;
        const newUsers = (loadedUsers as PagedResponse<UserProfile>).content ?? [];

        setLocalUsersForPagination((prev) => {
            const map = new Map(prev.map((u) => [u.id, u]));
            newUsers.forEach((u: UserProfile) => map.set(u.id, u));
            return Array.from(map.values());
        });

        setIsLastPage((loadedUsers as PagedResponse<UserProfile>).last ?? false);
        loadingRef.current = false;
    }, [loadedUsers]);

    const handleUserClick = async (user: UserProfile) => {
        setLocalError(null);
        try {
            // ✅ groupe existant → on l'ouvre directement
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
                // 404 → on crée
            }

            // ✅ création du groupe
            const newGroup: GroupChat = await addGroup({
                name: `${user.firstName} ${user.lastName}`,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) },
                ],
            }).unwrap();

            onGroupSelected?.(newGroup);
            onClose?.();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    // ✅ ouverture automatique si ?user= dans l'URL
    useEffect(() => {
        if (!userId || !targetUser) return;
        handleUserClick(targetUser);
    }, [userId, targetUser]);

    // ✅ scroll infini sur la liste des utilisateurs
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
        if (nearBottom && !isFetching && !isLastPage && !loadingRef.current) {
            loadingRef.current = true;
            setPage((p) => p + 1);
        }
    };

    return {
        localUsersForPagination,
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick,
    };
};