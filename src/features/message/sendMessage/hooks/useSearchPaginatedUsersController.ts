import React, { useEffect, useRef, useState } from "react";
import { useFindUserQuery, useGetAllUsersQuery } from "../../../auth/api/authApi";
import type { UserProfile } from "../../../auth/profile/types/profile.types";
import { skipToken } from "@reduxjs/toolkit/query";
import type { PagedResponse } from "../../types/message.types";
import { useDebouncedController } from "../../../../hooks/useDebouncedController";

interface Props {
    size?: number;
}

export const useSearchPaginatedUsersController = ({ size = 15}: Props) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedController = useDebouncedController(300, searchTerm);
    const isSearchMode = Boolean(debouncedController.debounced.trim());

    // pagination pour la liste initiale
    const [page, setPage] = useState(0);
    const [pagedUsers, setPagedUsers] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const loadingRef = useRef(false);

    const [users, setUsers] = useState<UserProfile[]>([]);

    // requête 1 : liste initiale paginée — active uniquement hors recherche
    const { data: allUsersData, isFetching: isFetchingAll } = useGetAllUsersQuery(
        { page, size },
        { skip: isSearchMode }
    );

    // requête recherche utilisateur (debounced) -> toujours page 0 pour la recherche
    const userQueryParams = (() => {
        const q = debouncedController.debounced.trim();
        if (!q) return null;
        const parts = q.split(" ");
        return { firstName: parts[0] || undefined, lastName: parts.slice(1).join(" ") || undefined, size, page: 0 };
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
            const incoming = (() => {
                if (!searchData) return [];
                if (Array.isArray(searchData)) return searchData as UserProfile[];
                return (searchData as PagedResponse<UserProfile>).content ?? [];
            })();
            setUsers(incoming);
            const deduceLast = incoming.length < size;
            setIsLastPage(Boolean((searchData as PagedResponse<UserProfile>)?.last) || deduceLast);
            loadingRef.current = false;
        } else {
            setUsers(pagedUsers);
        }
    }, [isSearchMode, searchData, pagedUsers]);

    // Quand on entre en recherche, on réinitialise la pagination de la liste initiale
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

    return {
        users,
        isFetching,
        isLastPage,
        isSearchMode,
        searchTerm,
        setSearchTerm,
        handleScroll,
        isSearching: isSearchMode && isFetchingSearch,
    };
};