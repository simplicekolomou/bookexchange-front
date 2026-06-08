import { useEffect, useRef, useState } from "react";
import {
    useAddGroupChatMutation,
    useLazyFindGroupByMembersQuery,
} from "../../api/messageApi.ts";
import type { AddGroupRequest, GroupChat, PagedResponse } from "../../types/message.types.ts";
import {
    useGetAllUsersQuery,
    useGetCurrentUserQuery,
    useGetUserQuery,
    useFindUserQuery,
} from "../../../auth/api/authApi.ts";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import {useDebouncedController} from "../../../../hooks/useDebouncedController.ts";

interface Props {
    onGroupSelected?: (group: GroupChat) => void;
    onClose?: () => void;
}

export const useCreateDirectChatController = ({ onGroupSelected, onClose }: Props) => {
    const { t } = useTranslation("message");
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;

    // Recherche
    const [searchTerm, setSearchTerm] = useState("");
    const { debounced: debouncedSearch } = useDebouncedController(300, searchTerm);

    // Pagination classique
    const [page, setPage] = useState(0);
    const size = 15;
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);
    const loadingRef = useRef(false);

    // Requêtes API
    const { data: loadedUsers, isFetching: isFetchingAll } = useGetAllUsersQuery(
        { page, size },
        { skip: !!debouncedSearch }
    );
    const { data: searchData, isFetching: isFetchingSearch } = useFindUserQuery(
        {
            page: 0,
            size: 100,
            firstName: debouncedSearch || undefined,
            lastName: debouncedSearch || undefined,
        },
        { skip: !debouncedSearch }
    );

    const isFetching = debouncedSearch ? isFetchingSearch : isFetchingAll;
    const data = debouncedSearch ? searchData : loadedUsers;

    const { data: currentUser } = useGetCurrentUserQuery();
    const { data: targetUser } = useGetUserQuery(
        { userId: userId ?? "" },
        { skip: !userId }
    );

    const [addGroup] = useAddGroupChatMutation();
    const [triggerFindGroup] = useLazyFindGroupByMembersQuery();

    // Réinitialisation quand le terme de recherche change
    useEffect(() => {
        if (debouncedSearch) {
            setPage(0);
            setUsers([]);
            setIsLastPage(false);
            loadingRef.current = false;
        }
    }, [debouncedSearch]);

    // Mise à jour de la liste d'utilisateurs
    useEffect(() => {
        if (!data) return;
        const newUsers = (data as PagedResponse<UserProfile>).content ?? [];
        setUsers((prev) => {
            if (debouncedSearch) {
                return newUsers; // remplacement
            }
            // accumulation sans doublons
            const map = new Map(prev.map((u) => [u.id, u]));
            newUsers.forEach((u) => map.set(u.id, u));
            return Array.from(map.values());
        });
        setIsLastPage((data as PagedResponse<UserProfile>).last ?? false);
        loadingRef.current = false;
    }, [data, debouncedSearch]);

    // Création / ouverture d'une conversation directe
    const handleAddDirectGroup = async (user: UserProfile) => {
        setLocalError(null);
        try {
            // Vérifier si le groupe existe déjà
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

            // Création du groupe direct
            const newGroup: AddGroupRequest = {
                groupType: "DIRECT",
                name: null,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) },
                ],
            };
            const result: GroupChat = await addGroup(newGroup).unwrap();
            onGroupSelected?.(result);
            onClose?.();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    // Ouverture automatique si ?user= présent dans l'URL
    useEffect(() => {
        if (!userId || !targetUser) return;
        handleAddDirectGroup(targetUser);
    }, [userId, targetUser]);

    // Scroll infini (uniquement en mode non-recherche)
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (debouncedSearch) return;
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
        if (nearBottom && !isFetching && !isLastPage && !loadingRef.current) {
            loadingRef.current = true;
            setPage((p) => p + 1);
        }
    };

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
        isSearching: debouncedSearch && isFetchingSearch,
    };
};