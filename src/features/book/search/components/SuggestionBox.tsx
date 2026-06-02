import {
    Box,
    Combobox,
    HStack,
    Image,
    Portal,
    Text,
    Spinner,
    useListCollection,
    Heading
} from "@chakra-ui/react";
import type { BookCopy } from "../../types/book.types.ts";
import type { UserProfile } from "../../../profile/types/profile.types.ts";
import { useFindUserQuery } from "../../../profile/api/profileApi.ts";
import { useFindBookQuery } from "../../api/bookApi.ts";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useTranslation } from "react-i18next";
import { FilterBox, type FilterValues } from "./FilterBox.tsx";
import React, { useEffect, useRef, useState } from "react";
import type { PagedResponse } from "../../../message/types/message.types.ts";

interface Props {
    initialQuery?: string;
    onSelectItem: (item: BookCopy | UserProfile) => void;
    searchType: "books" | "users";
}

export const SuggestionBox = ({
                                  initialQuery = "",
                                  onSelectItem,
                                  searchType,
                              }: Props) => {
    const { t } = useTranslation("search");

    const [inputValue, setInputValue] = useState(initialQuery);
    const [page, setPage] = useState(0);

    const lastPageRef = useRef(false);
    const loadingRef = useRef(false);
    const shouldResetRef = useRef(true);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const usersBufferRef = useRef<UserProfile[]>([]);
    const size = 10;

    const [filters, setFilters] = useState<FilterValues>({
        availability: false,
        bookState: "",
    });

    const debounced = useDebounced(inputValue, 400);

    // Reinitialisation de la pagination

    useEffect(() => {
        setPage(0);
        lastPageRef.current = false;
        loadingRef.current = false;
        shouldResetRef.current = true;
    }, [debounced, filters.availability, filters.bookState, searchType]);

    // query params

    const bookQueryParams = (() => {
        const q = debounced.trim();
        if (!q) return null;

        const clean = q.replace(/\s+/g, "").replace(/ISBN(?:-1[03])?:?/i, "");
        const isIsbn =
            /^\d{13}$/.test(clean.replace(/-/g, "")) ||
            /^\d{10}$/.test(clean.replace(/-/g, ""));

        const availability = filters.availability
            ? { availability: String(filters.availability) }
            : {};
        const bookState = filters.bookState
            ? { bookState: filters.bookState }
            : {};

        if (isIsbn) {
            return {
                isbn: clean.replace(/-/g, ""),
                size,
                page,
                ...availability,
                ...bookState,
            };
        }

        const dashIndex = q.indexOf(" - ");
        if (dashIndex > 0) {
            return {
                author: q.slice(0, dashIndex).trim(),
                title: q.slice(dashIndex + 3).trim(),
                size,
                page,
                ...availability,
                ...bookState,
            };
        }

        return { title: q, size, page, ...availability, ...bookState };
    })();

    const userQueryParams = (() => {
        const q = debounced.trim();
        if (!q) return null;
        const parts = q.split(" ");
        return {
            firstName: parts[0] || undefined,
            lastName: parts.slice(1).join(" ") || undefined,
            size,
            page,
        };
    })();

    const bookQueryArg =
        searchType !== "books" || !bookQueryParams ? skipToken : bookQueryParams;
    const userQueryArg =
        searchType !== "users" || !userQueryParams ? skipToken : userQueryParams;

    // queries

    const {
        data: books,
        isFetching: isBookFetching,
        isError: isBookError,
        error: bookError,
    } = useFindBookQuery(bookQueryArg);

    const {
        data: users,
        isFetching: isUserFetching,
        isError: isUserError,
        error: userError,
    } = useFindUserQuery(userQueryArg);

    // collections

    const { collection: booksCollection, set: setBooks } =
        useListCollection<BookCopy>({
            initialItems: [],
            itemToString: (item) => item.title,
            itemToValue: (item) => item.id,
        });

    const { collection: usersCollection, set: setUsers } =
        useListCollection<UserProfile>({
            initialItems: [],
            itemToString: (item) => `${item.firstName} ${item.lastName}`,
            itemToValue: (item) => item.id.toString(),
        });

    // scroll

    const handleScroll = (
        e: React.UIEvent<HTMLDivElement>,
        fetching: boolean
    ) => {
        const el = e.currentTarget;
        contentRef.current = el;

        if (lastPageRef.current || shouldResetRef.current || fetching || loadingRef.current) {
            return;
        }

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

    // accumulation des addpages

    useEffect(() => {
        const container = contentRef.current;
        const wasReset = shouldResetRef.current;
        const prevScroll = wasReset ? 0 : container?.scrollTop ?? 0;
        const prevScrollHeight = wasReset ? 0 : container?.scrollHeight ?? 0;
        const deduceLast = (incoming: unknown[]) => incoming.length < size;

        if (searchType === "books" && books) {
            const incoming = getPageContent(books);
            const existing = wasReset ? [] : booksCollection.items ?? [];

            const map = new Map(existing.map((b) => [b.id, b]));
            incoming.forEach((b) => {
                const vol = getVolume(b);
                if (vol) map.set(vol.id, vol);
            });

            setBooks(Array.from(map.values()));

            // Marque la dernière page si l'API l'indique ou si on reçoit moins d'items que la taille
            lastPageRef.current = Boolean((books as PagedResponse<BookCopy>).last) || deduceLast(incoming);
            shouldResetRef.current = false;
        }

        if (searchType === "users" && users) {
            const incoming = getPageContent(users);
            console.log("Les nouvelles users reçus :", incoming);
            const existing = wasReset ? [] : usersCollection.items ?? [];

            console.log("Nouvelle page users :", incoming);

            if (wasReset) {
                usersBufferRef.current = [];
            }

            const map = new Map(existing.map((u) => [u.id, u]));

            incoming.forEach(u => {
                if (u?.id != null) {
                    map.set(String(u.id), u);
                }
            });

            setUsers(Array.from(map.values()));

            // Marque la dernière page si l'API l'indique ou si on reçoit moins d'items que la taille
            lastPageRef.current = Boolean((users as PagedResponse<UserProfile>).last) || deduceLast(incoming);
            loadingRef.current = false;
        }
        shouldResetRef.current = false;

        // Restaurer la position en tenant compte du changement de hauteur (pour garder la vue sur les mêmes items)
        requestAnimationFrame(() => {
            if (!wasReset && container) {
                const newScrollHeight = container.scrollHeight ?? 0;
                const heightDelta = newScrollHeight - prevScrollHeight;
                // si la hauteur a augmenté à cause du chargement de la nouvelle page, on ajuste le scroll
                container.scrollTop = Math.max(0, prevScroll + heightDelta);
            }
        });
    }, [books, users, page, searchType, setBooks, setUsers]);

    // helpers

    function getVolume(item: BookCopy | UserProfile): BookCopy | undefined {
        if (!item) return undefined;
        const v = item as Partial<{ volume?: BookCopy; book?: BookCopy }>;
        if (v.volume) return v.volume;
        if (v.book) return v.book;
        return item as BookCopy;
    }

    function selectItem(item: BookCopy | UserProfile) {
        if (searchType === "books") {
            const v = getVolume(item);
            if (v) {
                setInputValue(v.title);
                onSelectItem(v);
            }
        } else {
            const u = item as UserProfile;
            setInputValue(`${u.firstName ?? ""} ${u.lastName ?? ""}`.trim());
            onSelectItem(u);
        }
    }

    let errorMessage: string | null = null;
    const error = searchType === "books" ? bookError : userError;
    const isError = searchType === "books" ? isBookError : isUserError;

    if (isError && error) {
        if ("status" in error) {
            errorMessage =
                typeof error.data === "string"
                    ? error.data
                    : `HTTP ${error.status}`;
        } else {
            errorMessage = error.message ?? "Network error";
        }
    }

    if (searchType === "books") {
        return (
            <Box>
                <Heading>{t("titleBookSearch")}</Heading>
                <FilterBox
                    values={filters}
                    onChange={(values) => setFilters((prev) => ({ ...prev, ...(values as Partial<FilterValues>) }))}
                />
                <Combobox.Root
                    collection={booksCollection}
                    openOnClick={true}
                    inputValue={inputValue}
                    onInputValueChange={(e) => {
                        if (e.reason === "input-change") {
                            setInputValue(e.inputValue);
                        }
                    }}
                    positioning={{ sameWidth: false, placement: "bottom-end" }}
                >
                    <Combobox.Control>
                        <Combobox.Input placeholder={t("searchBookPlaceholder")} />
                        <Combobox.IndicatorGroup>
                            <Combobox.ClearTrigger />
                            <Combobox.Trigger />
                        </Combobox.IndicatorGroup>
                    </Combobox.Control>

                    <Portal>
                        <Combobox.Positioner>
                            <Combobox.Content
                                minW="lg"
                                bg="white"
                                color="gray.800"
                                border="1px solid"
                                borderColor="gray.200"
                                boxShadow="md"
                                zIndex={10}
                                onScroll={(e) =>handleScroll(e, isBookFetching)}
                            >
                                {isBookFetching ? (
                                    <HStack p="2">
                                        <Spinner size="xs" borderWidth="1px" />
                                        <Text>Recherche…</Text>
                                    </HStack>
                                ) : errorMessage ? (
                                    <Text p="2" color="fg.error">
                                        {errorMessage}
                                    </Text>
                                ) : booksCollection.items?.length ? (
                                    booksCollection.items.map((book: BookCopy) => (
                                        <Combobox.Item
                                            key={book.id}
                                            item={book}
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                            }}
                                            onClick={() => selectItem(book)}
                                        >
                                            <HStack justify="flex-start" align="center" gap="3" py="2">
                                                {book.id ? (
                                                    <Image
                                                        src={book.coverPictureApiUrl}
                                                        alt={book.title}
                                                        boxSize="130px"
                                                        objectFit="contain"
                                                        borderRadius="md"
                                                    />
                                                ) : (
                                                    <span
                                                        style={{
                                                            width: 130,
                                                            height: 40,
                                                            background: "var(--chakra-colors-gray-100)",
                                                            borderRadius: 8,
                                                            display: "inline-block",
                                                        }}
                                                    />
                                                )}
                                                <Box style={{ minWidth: 0 }} display="flex" flexDirection="column">
                                                    <Text fontWeight="medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        {book.title}
                                                    </Text>
                                                    <Text color="fg.muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                        {book.authors?.join(", ")}
                                                    </Text>
                                                </Box>
                                            </HStack>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    ))
                                ) : debounced ? (
                                    <Text p="2" color="fg.muted">
                                        {t("noResults")}
                                    </Text>
                                ) : (
                                    <Text p="2" color="fg.muted">
                                        {t("tapToSearch")}
                                    </Text>
                                )}
                            </Combobox.Content>
                        </Combobox.Positioner>
                    </Portal>
                </Combobox.Root>
            <Box>
                <Text mt={1} fontSize="xs" color="gray.500">
                    {t("bookAstuces")}
                </Text>
            </Box>
        </Box>
        );
    }

    return (
        <Box>
            <Heading>
                {t("titleUserSearch")}
            </Heading>
            <Combobox.Root
                collection={usersCollection}
                openOnClick={true}
                inputValue={inputValue}
                onInputValueChange={(e) => {
                    if (e.reason === "input-change") {
                        setInputValue(e.inputValue);
                    }
                }}
                positioning={{ sameWidth: false, placement: "bottom-end" }}
            >
                <Combobox.Control>
                    <Combobox.Input placeholder={t("searchUserPlaceholder")} />
                    <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger />
                        <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                </Combobox.Control>
                <Portal>
                    <Combobox.Positioner>
                        <Combobox.Content
                            minW="lg"
                            bg="white"
                            color="gray.800"
                            border="1px solid"
                            borderColor="gray.200"
                            boxShadow="md"
                            zIndex={10}
                            onScroll={(e) =>handleScroll(e, isUserFetching)}
                        >
                            {isUserFetching ? (
                                <HStack p="2">
                                    <Spinner size="xs" borderWidth="1px" />
                                    <Text>Recherche…</Text>
                                </HStack>
                            ) : errorMessage ? (
                                <Text p="2" color="fg.error">
                                    {errorMessage}
                                </Text>
                            ) : usersCollection.items?.length ? (
                                usersCollection.items.map((user: UserProfile) => (
                                    <Combobox.Item
                                        bg="white"
                                        _hover={{ bg: "gray.100" }}
                                        _focus={{ bg: "gray.100" }}
                                        key={user.id}
                                        item={user}
                                        onPointerDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onClick={() => selectItem(user)}
                                    >
                                        <HStack justify="flex-start" align="center" gap="3" py="2">
                                            {user.id ? (
                                                <Image
                                                    src={user.profilePicture}
                                                    alt={`${user.firstName} ${user.lastName}`}
                                                    boxSize="130px"
                                                    objectFit="contain"
                                                    borderRadius="md"
                                                />
                                            ) : (
                                                <span
                                                    style={{
                                                        width: 130,
                                                        height: 40,
                                                        background: "var(--chakra-colors-gray-100)",
                                                        borderRadius: 8,
                                                        display: "inline-block",
                                                    }}
                                                />
                                            )}
                                            <Box style={{ minWidth: 0 }} display="flex" flexDirection="column">
                                                <Text fontWeight="medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {user.firstName} {user.lastName}
                                                </Text>
                                                <Text color="fg.muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                    {user.bio}
                                                </Text>
                                            </Box>
                                        </HStack>
                                        <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                ))
                            ) : debounced ? (
                                <Text p="2" color="fg.muted">
                                    {t("noResults")}
                                </Text>
                            ) : (
                                <Text p="2" color="fg.muted">
                                    {t("tapToSearch")}
                                </Text>
                            )}
                        </Combobox.Content>
                    </Combobox.Positioner>
                </Portal>
            </Combobox.Root>
            <Box>
                <Text mt={1} fontSize="xs" color="gray.500">
                    {t("userAstuces")}
                </Text>
            </Box>
        </Box>
    );
};

/* ---------- small debounce hook ---------- */
function useDebounced<T>(value: T, delay = 500) {
    const [v, setV] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setV(value), delay);
        return () => clearTimeout(t);
    }, [value, delay]);
    return v;
}
