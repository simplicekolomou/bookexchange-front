import React, { useEffect, useRef, useState } from "react";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import { useGetAllUsersQuery, useFindUserQuery } from "../../../auth/api/authApi.ts";
import { useAddGroupChatMutation } from "../../api/messageApi.ts";
import { useTranslation } from "react-i18next";
import type {AddGroupRequest, GroupChat, GroupChatType, PagedResponse} from "../../types/message.types.ts";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../auth/authSlice.ts";
import { useDebouncedController } from "../../../../hooks/useDebouncedController.ts";
import { skipToken } from "@reduxjs/toolkit/query/react";

interface Props {
    onClose: () => void;
    onGroupCreated: (group: GroupChat) => void;
}

const SIZE = 15;

export const useGroupBoxController = ({ onClose, onGroupCreated }: Props) => {
    const { t } = useTranslation("message");
    const currentUserId = useSelector(selectCurrentUserId);

    const [searchTerm, setSearchTerm] = useState("");
    const debouncedController = useDebouncedController(300, searchTerm);
    const isSearchMode = Boolean(debouncedController.debounced.trim());

    // pagination pour la liste initiale
    const [page, setPage] = useState(0);
    const [pagedUsers, setPagedUsers] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const loadingRef = useRef(false);

    const [users, setUsers] = useState<UserProfile[]>([]); // remplacement de useListCollection

    const [groupName, setGroupName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const [addGroup, { isLoading }] = useAddGroupChatMutation();

    // requête 1 : liste initiale paginée — active uniquement hors recherche
    const { data: allUsersData, isFetching: isFetchingAll } = useGetAllUsersQuery(
        { page, size: SIZE },
        { skip: isSearchMode }
    );

    // requête recherche utilisateur (debounced) -> toujours page 0 pour la recherche
    const userQueryParams = (() => {
        const q = debouncedController.debounced.trim();
        if (!q) return null;
        const parts = q.split(" ");
        return { firstName: parts[0] || undefined, lastName: parts.slice(1).join(" ") || undefined, size: SIZE, page: 0 };
    })();

    const userQueryArg = !isSearchMode || !userQueryParams ? skipToken : userQueryParams;
    const { data: searchData, isFetching: isFetchingSearch } = useFindUserQuery(userQueryArg);

    // accumulation de la liste paginée initiale (hors recherche)
    useEffect(() => {
        if (!allUsersData || isSearchMode) return;
        const newUsers = (allUsersData as PagedResponse<UserProfile>).content ?? [];
        setPagedUsers((prev) => {
            const map = new Map(prev.map((u) => [String(u.id), u]));
            newUsers.forEach((u: UserProfile) => map.set(String(u.id), u));
            return Array.from(map.values());
        });
        setIsLastPage(Boolean((allUsersData as PagedResponse<UserProfile>).last));
        loadingRef.current = false;
    }, [allUsersData, isSearchMode]);

    // synchronisation de l'affichage selon mode recherche / pagination
    useEffect(() => {
        if (isSearchMode) {
            console.log("Résultats de recherche reçus avant :", searchData);
            const incoming = (() => {
                if (!searchData) return [];
                if (Array.isArray(searchData)) return searchData as UserProfile[];
                return (searchData as PagedResponse<UserProfile>).content ?? [];
            })();
            console.log("Résultats de recherche reçus :", incoming);
            setUsers(incoming);
            const deduceLast = incoming.length < SIZE;
            setIsLastPage(Boolean((searchData as PagedResponse<UserProfile>)?.last) || deduceLast);
            loadingRef.current = false;
        } else {
            setUsers(pagedUsers);
        }
    }, [isSearchMode, searchData, pagedUsers]);

    // quand on entre en recherche, on réinitialise la pagination de la liste initiale
    useEffect(() => {
        if (isSearchMode) {
            setPage(0);
            setPagedUsers([]);
            setIsLastPage(false);
        }
    }, [isSearchMode]);

    const isFetching = isSearchMode ? isFetchingSearch : isFetchingAll;

    // scroll infini uniquement sur la liste initiale
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        if (isSearchMode) return;
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
        if (nearBottom && !isFetching && !isLastPage && !loadingRef.current) {
            loadingRef.current = true;
            setPage((p) => p + 1);
        }
    };

    const toggleMember = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId)
                ? prev.filter((id) => id !== userId)
                : [...prev, userId]
        );
    };

    const handleCreateGroup = async () => {
        const groupType: GroupChatType = "GROUP"; // ou 'DIRECT' selon ton UI
        setLocalError(null);

        if (groupType === 'GROUP') {
            if (!groupName.trim()) {
                setLocalError(t("createGroup.nameRequired"));
                return;
            }
            if (selectedUserIds.length < 2) {
                setLocalError(t("createGroup.minMembers"));
                return;
            }
        }

        try {
            const allMemberIds = [...new Set([currentUserId, ...selectedUserIds])].filter(Boolean);

            const newGroup: AddGroupRequest = {
                name: groupType === 'GROUP' ? groupName.trim() : null,
                groupType: groupType,
                members: allMemberIds.map((id) => ({
                    notification: true,
                    endUserId: Number(id),
                })),
            }

            const result = await addGroup(newGroup).unwrap();

            setGroupName("");
            setSelectedUserIds([]);
            onGroupCreated(result);
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
        setPage(0);
        setPagedUsers([]);
        setUsers([]);
        onClose();
    };

    return {
        users,           // liste affichée (maintenue via useState)
        isFetching,
        isLastPage,
        isSearchMode,
        groupName,
        setGroupName,
        selectedUserIds,
        toggleMember,
        handleScroll,
        handleCreateGroup,
        handleClose,
        isLoading,
        localError,
        t,
        searchTerm,
        setSearchTerm,
        isSearching: isFetchingSearch && isSearchMode,
    };
};
