// typescript
import React, { useEffect, useRef, useState, useMemo } from "react";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import {useFindUserQuery, useGetAllUsersQuery} from "../../../auth/api/authApi.ts";
import { useAddGroupChatMutation } from "../../api/messageApi.ts";
import { useTranslation } from "react-i18next";
import type { GroupChat, PagedResponse } from "../../types/message.types.ts";
import { useSelector } from "react-redux";
import { selectCurrentUserId } from "../../../auth/authSlice.ts";
import { useDebouncedController } from "../../../../hooks/useDebouncedController.ts";

interface Props {
    onClose: () => void;
    onGroupCreated: (group: GroupChat) => void;
}

export const useGroupBoxController = ({ onClose, onGroupCreated }: Props) => {
    const { t } = useTranslation("message");
    const currentUserId = useSelector(selectCurrentUserId);

    // États pour la recherche
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearch = useDebouncedController(300, searchTerm);

    // États pour la liste paginée
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const [page, setPage] = useState(0);
    const size = 15;
    const { data: loadedUsers, isFetching } = useGetAllUsersQuery({ page, size });

    // États pour le groupe
    const [groupName, setGroupName] = useState("");
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);

    const [addGroup, { isLoading }] = useAddGroupChatMutation();
    const loadingRef = useRef(false);

    // Mémoïse les paramètres de requête pour éviter un nouvel objet à chaque render
    const queryArgs = useMemo(() => {
        // useDebouncedController semble renvoyer { debounced: string } ou undefined
        const searchValue =
            typeof debouncedSearch === "string" ? debouncedSearch : debouncedSearch?.debounced;

        return {
            page,
            size,
            // n'envoyer les champs que si on recherche — sinon undefined pour stabilité
            firstName: searchValue ?? undefined,
            lastName: searchValue ?? undefined,
        };
    }, [page, size, debouncedSearch?.debounced]);

// Requête API – utilise le terme débouncé (moins de rerenders)
    const { data } = useFindUserQuery(queryArgs, { skip: false });

    // 🔁 Réinitialisation quand le terme de recherche débouncé change
    useEffect(() => {
        // éviter setState inutiles qui peuvent causer des rerenders en cascade
        loadingRef.current = false;
        setIsLastPage(false);
        if (page !== 0) setPage(0);
        // ne vider la liste que si elle n'est pas déjà vide
        setUsers((prev) => (prev.length > 0 ? [] : prev));
    }, [debouncedSearch]); // stable car débouncedSearch est stable

    // utilitaire de comparaison par id pour éviter setState si identique
    const sameById = (a: UserProfile[], b: UserProfile[]) => {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) if (a[i].id !== b[i].id) return false;
        return true;
    };

    // Accumulation des résultats paginés
    useEffect(() => {
        if (!data) return;
        const newUsers = (data as PagedResponse<UserProfile>).content ?? [];
        setUsers((prev) => {
            if (debouncedSearch) {
                // en mode recherche, on remplace complètement — mais on évite setState si identique
                return sameById(prev, newUsers) ? prev : newUsers;
            }
            // sinon, accumulation sans doublons
            const map = new Map(prev.map((u) => [u.id, u]));
            newUsers.forEach((u: UserProfile) => map.set(u.id, u));
            const merged = Array.from(map.values());
            return sameById(prev, merged) ? prev : merged;
        });
        setIsLastPage((data as PagedResponse<UserProfile>).last ?? false);
        loadingRef.current = false;
    }, [data, debouncedSearch]);

    // Scroll infini
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
        if (nearBottom && !isFetching && !isLastPage && !loadingRef.current && !debouncedSearch) {
            loadingRef.current = true;
            setPage((p) => p + 1);
        }
    };

    // Toggle sélection
    const toggleMember = (userId: string) => {
        setSelectedUserIds((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    // Création du groupe
    const handleCreateGroup = async () => {
        setLocalError(null);
        if (!groupName.trim()) {
            setLocalError(t("createGroup.nameRequired"));
            return;
        }
        if (selectedUserIds.length === 0) {
            setLocalError(t("createGroup.minMembers"));
            return;
        }

        try {
            const newGroup: GroupChat = await addGroup({
                name: groupName.trim(),
                members: [
                    ...new Set([currentUserId, ...selectedUserIds])
                ].filter(Boolean).map((id) => ({
                    notification: true,
                    endUserId: Number(id),
                })),
            }).unwrap();

            // Reset et fermeture
            setGroupName("");
            setSelectedUserIds([]);
            onGroupCreated(newGroup);
            onClose();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    // Fermeture avec reset
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
        isSearching: isFetching && page === 0 && Boolean(debouncedSearch),
        loadedUsers,
    };
};