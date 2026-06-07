import { useState, useEffect, useRef } from "react";
import { useListCollection } from "@chakra-ui/react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useTranslation } from "react-i18next";
import React from "react";
import type { BookCopy } from "../../types/book.types.ts";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import type { PagedResponse } from "../../../message/types/message.types.ts";
import type { FilterValues } from "./useFilterController.ts";
import { useFindBookQuery } from "../../api/bookApi.ts";
import {useDebouncedController} from "../../../../hooks/useDebouncedController.ts";
import {useFindUserQuery} from "../../../auth/api/authApi.ts";

interface Props {
    initialQuery?: string;
    onSelectItem: (item: BookCopy | UserProfile) => void;
    searchType: "books" | "users";
}

const SIZE = 10;

export const useSuggestionController = ({ initialQuery = "", onSelectItem, searchType }: Props) => {
    const { t } = useTranslation("search");

    const [inputValue, setInputValue] = useState(initialQuery);
    const [page, setPage] = useState(0);
    const [filters, setFilters] = useState<FilterValues>({
        availability: false,
        bookState: "",
    });

    const lastPageRef = useRef(false);
    const loadingRef = useRef(false);
    const shouldResetRef = useRef(true);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const usersBufferRef = useRef<UserProfile[]>([]);
    const debouncedController = useDebouncedController(400, inputValue);

    // Réinitialisation de la pagination
    useEffect(() => {
        setPage(0);
        lastPageRef.current = false;
        loadingRef.current = false;
        shouldResetRef.current = true;
    }, [debouncedController.debounced, filters.availability, filters.bookState, searchType]);

    // Query params
    const bookQueryParams = (() => {
        const q = debouncedController.debounced.trim();
        if (!q) return null;

        const clean = q.replace(/\s+/g, "").replace(/ISBN(?:-1[03])?:?/i, "");
        const isIsbn =
            /^\d{13}$/.test(clean.replace(/-/g, "")) ||
            /^\d{10}$/.test(clean.replace(/-/g, ""));

        const availability = filters.availability ? { availability: String(filters.availability) } : {};
        const bookState = filters.bookState ? { bookState: filters.bookState } : {};

        if (isIsbn) return { isbn: clean.replace(/-/g, ""), size: SIZE, page, ...availability, ...bookState };

        const dashIndex = q.indexOf(" - ");
        if (dashIndex > 0) {
            return {
                author: q.slice(0, dashIndex).trim(),
                title: q.slice(dashIndex + 3).trim(),
                size: SIZE, page, ...availability, ...bookState,
            };
        }

        return { title: q, size: SIZE, page, ...availability, ...bookState };
    })();

    const userQueryParams = (() => {
        const q = debouncedController.debounced.trim();
        if (!q) return null;
        const parts = q.split(" ");
        return { firstName: parts[0] || undefined, lastName: parts.slice(1).join(" ") || undefined, size: SIZE, page };
    })();

    const bookQueryArg = searchType !== "books" || !bookQueryParams ? skipToken : bookQueryParams;
    const userQueryArg = searchType !== "users" || !userQueryParams ? skipToken : userQueryParams;

    const { data: books, isFetching: isBookFetching, isError: isBookError, error: bookError } = useFindBookQuery(bookQueryArg);
    const { data: users, isFetching: isUserFetching, isError: isUserError, error: userError } = useFindUserQuery(userQueryArg);

    const { collection: booksCollection, set: setBooks } = useListCollection<BookCopy>({
        initialItems: [],
        itemToString: (item) => item.title,
        itemToValue: (item) => item.id,
    });

    const { collection: usersCollection, set: setUsers } = useListCollection<UserProfile>({
        initialItems: [],
        itemToString: (item) => `${item.firstName} ${item.lastName}`,
        itemToValue: (item) => item.id.toString(),
    });

    // Scroll infini
    const handleScroll = (e: React.UIEvent<HTMLDivElement>, fetching: boolean) => {
        const el = e.currentTarget;
        contentRef.current = el;
        if (lastPageRef.current || shouldResetRef.current || fetching || loadingRef.current) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
            loadingRef.current = true;
            setPage((p) => p + 1);
        }
    };

    function getPageContent<T>(page: PagedResponse<T>): T[] {
        if (!page) return [];
        if (Array.isArray(page)) return page;
        if (Array.isArray(page.content)) return page.content;
        return [];
    }

    function getVolume(item: BookCopy | UserProfile): BookCopy | undefined {
        if (!item) return undefined;
        const v = item as Partial<{ volume?: BookCopy; book?: BookCopy }>;
        if (v.volume) return v.volume;
        if (v.book) return v.book;
        return item as BookCopy;
    }

    // Accumulation des pages
    useEffect(() => {
        const container = contentRef.current;
        const wasReset = shouldResetRef.current;
        const prevScroll = wasReset ? 0 : container?.scrollTop ?? 0;
        const prevScrollHeight = wasReset ? 0 : container?.scrollHeight ?? 0;
        const deduceLast = (incoming: unknown[]) => incoming.length < SIZE;

        if (searchType === "books" && books) {
            const incoming = getPageContent(books);
            const existing = wasReset ? [] : booksCollection.items ?? [];
            const map = new Map(existing.map((b) => [b.id, b]));
            incoming.forEach((b) => {
                const vol = getVolume(b);
                if (vol) map.set(vol.id, vol);
            });
            setBooks(Array.from(map.values()));
            lastPageRef.current = Boolean((books as PagedResponse<BookCopy>).last) || deduceLast(incoming);
            shouldResetRef.current = false;
        }

        if (searchType === "users" && users) {
            const incoming = getPageContent(users);
            const existing = wasReset ? [] : usersCollection.items ?? [];
            if (wasReset) usersBufferRef.current = [];
            const map = new Map(existing.map((u) => [u.id, u]));
            incoming.forEach((u) => { if (u?.id != null) map.set(String(u.id), u); });
            setUsers(Array.from(map.values()));
            lastPageRef.current = Boolean((users as PagedResponse<UserProfile>).last) || deduceLast(incoming);
            loadingRef.current = false;
        }

        shouldResetRef.current = false;

        requestAnimationFrame(() => {
            if (!wasReset && container) {
                const heightDelta = (container.scrollHeight ?? 0) - prevScrollHeight;
                container.scrollTop = Math.max(0, prevScroll + heightDelta);
            }
        });
    }, [books, users, page, searchType, setBooks, setUsers]);

    // Gestion des erreurs
    const error = searchType === "books" ? bookError : userError;
    const isError = searchType === "books" ? isBookError : isUserError;
    let errorMessage: string | null = null;
    if (isError && error) {
        errorMessage = "status" in error
            ? (typeof error.data === "string" ? error.data : `HTTP ${error.status}`)
            : (error.message ?? "Network error");
    }

    function selectItem(item: BookCopy | UserProfile) {
        if (searchType === "books") {
            const v = getVolume(item);
            if (v) { setInputValue(v.title); onSelectItem(v); }
        } else {
            const u = item as UserProfile;
            setInputValue(`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim());
            onSelectItem(u);
        }
    }

    return {
        t,
        inputValue,
        setInputValue,
        filters,
        setFilters,
        debounced : debouncedController.debounced,
        booksCollection,
        usersCollection,
        isBookFetching,
        isUserFetching,
        errorMessage,
        handleScroll,
        selectItem,
    };
};