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
import type { BookCopy } from "../../../../types/book.types";
import React, { useEffect, useState } from "react";
import type { UserProfile } from "../../../../types/profile.types";
import { useFindUserQuery } from "../../../../features/profile/profileApi";
import { useFindBookQuery } from "../../../../features/book/bookApi";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {useTranslation} from "react-i18next";
import {FilterBox, type FilterValues} from "./FilterBox.tsx";

interface Props {
    initialQuery?: string;
    onSelectItem: (item: BookCopy | UserProfile) => void;
    searchType: "books" | "users";
}

export const SuggestionBox = ({ initialQuery = "", onSelectItem, searchType }: Props) => {
    const [inputValue, setInputValue] = useState(initialQuery);
    const {t} = useTranslation("search");
    const [, setPage] = useState(0);
    const size = 10;

    // state des filtres dans le parent (SuggestionBox)
    const [filters, setFilters] = useState<FilterValues>({ availability: false, bookState: "" });

    // Debounce
    const debounced = useDebounced(inputValue, 400);

    // reset page when query or filters or type change
    useEffect(() => {
        setPage(0);
    }, [debounced, filters.availability, filters.bookState, searchType]);

    const bookQueryParams = (() => {
        const q = debounced.trim();
        if (!q) return null;

        const clean = q.replace(/\s+/g, "").replace(/ISBN(?:-1[03])?:?/i, "");

        const isIsbn =
            /^\d{13}$/.test(clean.replace(/-/g, "")) ||
            /^\d{10}$/.test(clean.replace(/-/g, ""));

        const availability = filters.availability ? { availability: String(filters.availability) } : {};
        const bookState = filters.bookState ? { bookState: filters.bookState } : {};

        if (isIsbn) {
            return {
                isbn: clean.replace(/-/g, ""),
                size,
                ...availability,
                ...bookState
            };
        }

        const dashIndex = q.indexOf(" - ");
        if (dashIndex > 0) {
            return {
                author: q.slice(0, dashIndex).trim(),
                title: q.slice(dashIndex + 3).trim(),
                size,
                ...availability,
                ...bookState
            };
        }

        return {
            title: q,
            size,
            ...availability,
            ...bookState
        };
    })();

    const userQueryParams = (() => {
        const q = debounced.trim();
        if (!q) return null;
        const parts = q.split(" ");
        const firstName = parts.length > 0 ? parts[0] : undefined;
        const lastName = parts.length > 1 ? parts.slice(1).join(" ") : undefined;
        return {
            firstName: firstName || undefined,
            lastName: lastName || undefined,
            size
        };
    })();

    const bookQueryArg = searchType !== "books" || !bookQueryParams ? skipToken : bookQueryParams;
    const userQueryArg = searchType !== "users" || !userQueryParams ? skipToken : userQueryParams;

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

    // Chakra collection state
    const { collection: booksCollection, set: setBooks } = useListCollection<BookCopy>({
        initialItems: [],
        itemToString: (item) => item.title,
        itemToValue: (item) => item.id,
    });

    const { collection: usersCollection, set: setUsers } = useListCollection<UserProfile>({
        initialItems: [],
        itemToString: (item) => item.firstName + " " + item.lastName,
        itemToValue: (item) => item.id.toString(),
    });

    useEffect(() => {
        // Remplir les collections selon le type de recherche
        if (searchType === "books") {
            const items: BookCopy[] = (books?.content ?? [])
                .map((b) => {
                    const v = getVolume(b);
                    return v ? (v as unknown as BookCopy) : null;
                })
                .filter(Boolean) as BookCopy[];
            setBooks(items);
            setUsers([]);
        } else {
            const items: UserProfile[] = (users ?? []).map((u) => u as UserProfile);
            setUsers(items);
            setBooks([]);
        }
    }, [books, users, searchType, setBooks, setUsers]);

    let errorMessage: string | null = null;
    if (isBookError && bookError) {
        if ("status" in bookError) {
            errorMessage = typeof bookError.data === "string" ? bookError.data : `HTTP ${bookError.status}`;
        } else {
            errorMessage = bookError.message ?? "Network error";
        }
    }
    if (isUserError && userError) {
        if ("status" in userError) {
            errorMessage = typeof userError.data === "string" ? userError.data : `HTTP ${userError.status}`;
        } else {
            errorMessage = userError.message ?? "Network error";
        }
    }

    function getVolume(item: BookCopy | UserProfile): BookCopy | undefined {
        if (!item) return undefined;
        const v = item as Partial<{ volume?: BookCopy; book?: BookCopy }>;
        if (v.volume) return v.volume;
        if (v.book) return v.book;
        return item as BookCopy;
    }

    // renvoie l'item complet au parent:
    function selectItem(item: BookCopy | UserProfile) {
        const volume = getVolume(item);
        if (searchType === "books") {
            if (volume) {
                setInputValue(volume.title);
                onSelectItem(volume);
            }
        } else {
            // item est un UserProfile ici
            const user = item as UserProfile;
            setInputValue(`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || (user.email ?? ""));
            onSelectItem(user);
        }
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            const list = searchType === "books" ? booksCollection.items : usersCollection.items;
            if (list && list.length > 0) {
                selectItem(list[0]);
            }
        } else if (e.key === "Escape") {
            // clear input on escape
            setInputValue("");
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
                        <Combobox.Input placeholder={t("searchBookPlaceholder")} onKeyDown={onKeyDown} />
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
                    <Combobox.Input placeholder={t("searchUserPlaceholder")} onKeyDown={onKeyDown} />
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
