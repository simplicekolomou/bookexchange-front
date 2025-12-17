"use client";
import {
    Box,
    Input
} from "@chakra-ui/react";
import React, { useEffect, useRef, useState, useMemo } from "react";
import type { BookCopyAndOwner, VolumeShort } from "../../../../types/book.types";
import { useFindBookCopyAndOwnerQuery } from "../../../../features/book/bookApi";
import { BookResults } from "./BookResults.tsx";
import { UserResults } from "./UserResults.tsx";
import { SearchTabs } from "./SearchTabs.tsx";

type Props = {
    limit?: number;
    initialQuery?: string;
    onSelect: (item: VolumeShort) => void;
};

export function SearchBar({ limit = 10, initialQuery = "", onSelect }: Props) {
    const { data: booksAndOwners, isSuccess } = useFindBookCopyAndOwnerQuery();
    const [bookAndOwner, setBookAndOwner] = useState<BookCopyAndOwner[]>([]);
    const [inputValue, setInputValue] = useState(initialQuery);
    const [open, setOpen] = useState(false);
    const [highlight, setHighlight] = useState<number>(-1);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [searchType, setSearchType] = useState("books");

    const debounced = useDebounced(inputValue, 400);

    useEffect(() => {
        if (isSuccess && Array.isArray(booksAndOwners)) {
            setBookAndOwner(booksAndOwners);
        } else {
            setBookAndOwner([]);
        }
    }, [isSuccess, booksAndOwners]);

    useEffect(() => {
        if (debounced.trim()) {
            setOpen(true);
        } else {
            setOpen(false);
        }
        setHighlight(-1);
    }, [debounced]);

    // helper pour extraire un VolumeShort si présent
    function getVolume(item: BookCopyAndOwner | VolumeShort): VolumeShort | undefined {
        function hasVolumeOrBook(obj: unknown): obj is { volume?: VolumeShort; book?: VolumeShort } {
            return typeof obj === "object" && obj !== null && ("volume" in obj || "book" in obj);
        }

        if (hasVolumeOrBook(item)) {
            if (item.volume) return item.volume;
            if (item.book) return item.book;
        }

        return item as VolumeShort;
    }

    // Filtrer côté client la liste déjà chargée (titre / isbn / auteurs)
    const filteredResults = useMemo(() => {
        const q = debounced.trim().toLowerCase();
        if (!q) {
            return bookAndOwner.slice(0, limit);
        }
        return bookAndOwner
            .filter((item) => {
                const vol = getVolume(item);

                const title = vol?.title ?? (() => {
                    const r = item as unknown as Record<string, unknown>;
                    return typeof r.title === "string" ? r.title : "";
                })();

                const authorsArrFromItem = (() => {
                    const r = item as unknown as Record<string, unknown>;
                    const a = vol?.authors ?? r.authors ?? [];
                    if (Array.isArray(a)) return a.map(String);
                    if (typeof a === "string") return [a];
                    return [];
                })();

                const authors = authorsArrFromItem.join(" ");
                const extra = JSON.stringify(vol ?? item);
                const combined = `${title} ${authors} ${extra}`.toLowerCase();
                return combined.includes(q);
            })
            .slice(0, limit);
    }, [bookAndOwner, debounced, limit]);

    const results = filteredResults;

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!open) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => Math.min(results.length - 1, h + 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(-1, h - 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0 && results[highlight]) {
                selectItem(results[highlight]);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    }

    function selectItem(item: BookCopyAndOwner | VolumeShort) {
        const volume = getVolume(item);
        if (volume && volume.title) {
            setInputValue(volume.title);
        }
        setOpen(false);
        if (volume) onSelect(volume);
    }

    useEffect(() => {
        function onDocClick(e: MouseEvent) {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, []);

    return (
        <>
            <SearchTabs value={searchType} onChange={setSearchType} />
            <Box position="relative" ref={containerRef}>
                <Box position="relative">
                    <Input
                        placeholder="Rechercher un livre"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => { if (debounced.trim()) setOpen(true); }}
                        onKeyDown={onKeyDown}
                        pr="10" /* espace à droite pour le spinner */
                    />
                </Box>
                {searchType === "books" ? (
                    <Box mt={4}>
                        <BookResults books={filteredResults ?? []} />
                    </Box>
                ) : (
                    <Box mt={4}>
                        <UserResults books={filteredResults ?? []} />
                    </Box>
                )}
            </Box>
        </>
    );
}

/* ---------- small debounce hook ---------- */
function useDebounced<T>(value: T, delay = 500) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}