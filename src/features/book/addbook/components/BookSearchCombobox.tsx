"use client";

import {
    Combobox,
    HStack,
    Portal,
    Span,
    Spinner,
    Image,
    useListCollection, Box,
} from "@chakra-ui/react";
import {useEffect, useMemo, useState} from "react";
import type {VolumeShort} from "../../../../types/book.types.ts";
import { useGetBookSuggestionsQuery } from "../../api/bookApi.ts"; // adjust path if needed

type Props = {
    lang?: string;              // default "fre"
    limit?: number;             // default 10
    initialQuery?: string;
    onSelect: (item: VolumeShort) => void;
};

export function BookSearchCombobox({
                                       lang = "fre",
                                       limit = 5,
                                       initialQuery = "",
                                       onSelect,
                                   }: Props) {
    const [inputValue, setInputValue] = useState(initialQuery);

    // Chakra collection state
    const { collection, set } = useListCollection<VolumeShort>({
        initialItems: [],
        itemToString: (item) => item.title,
        itemToValue: (item) => item.id,
    });

    // Debounce
    const debounced = useDebounced(inputValue, 400);

    // Compute query args (title/author) from debounced input
    const searchArgs = useMemo(() => {
        const q = debounced.trim();
        if (!q) return null;

        const dash = q.indexOf(" - ");
        const author = dash > 0 ? q.slice(0, dash).trim() : undefined;
        const title = dash > 0 ? q.slice(dash + 3).trim() : q;

        return {
            title: title || undefined,
            author: author || undefined,
            lang,
            limit,
        };
    }, [debounced, lang, limit]);

    // 🔁 Call backend via RTK Query
    const {
        data,
        isFetching,
        isError,
        error,
    } = useGetBookSuggestionsQuery(searchArgs!, {
        skip: !searchArgs, // don't call if query empty
    });

    // Sync RTK Query data into Chakra collection
    useEffect(() => {
        if (!searchArgs) {
            set([]);
            return;
        }
        if (data) {
            set(data);
        } else if (!isFetching && !data) {
            set([]);
        }
    }, [data, isFetching, searchArgs, set]);

    // Normalize error message
    let errorMessage: string | null = null;
    if (isError && error) {
        if ("status" in error) {
            errorMessage = typeof error.data === "string"
                ? error.data
                : `HTTP ${error.status}`;
        } else {
            errorMessage = error.message ?? "Network error";
        }
    }

    return (
        <Combobox.Root
            collection={collection}
            placeholder="Rechercher un livre"
            openOnClick={true}
            inputValue={inputValue}                               // <— control value
            onInputValueChange={(e) => {
                if (e.reason === "input-change") {                       // <— only update when user types
                    setInputValue(e.inputValue);
                }
            }}
            positioning={{ sameWidth: false, placement: "bottom-end" }}
        >
            <Combobox.Label>Rechercher un livre</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input placeholder="Livre à chercher" />
                <Combobox.IndicatorGroup>
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger />
                </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content
                        minW="lg"
                        bg="white"                   // 👈 force light background
                        color="gray.800"             // 👈 readable text
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="md"
                        zIndex={10}                  // ensures it stays above everything
                    >
                        {isFetching ? (
                            <HStack p="2">
                                <Spinner size="xs" borderWidth="1px" />
                                <Span>Recherche…</Span>
                            </HStack>
                        ) : errorMessage ? (
                            <Span p="2" color="fg.error">
                                {errorMessage}
                            </Span>
                        ) : collection.items?.length ? (
                            collection.items.map((book: VolumeShort) => (
                                <Combobox.Item
                                    bg="white"
                                    _hover={{ bg: "gray.100" }}      // 👈 light grey hover
                                    _focus={{ bg: "gray.100" }}      // 👈 same for keyboard nav
                                    key={book.id}
                                    item={book}
                                    onPointerDown={(e) => {
                                        // prevent blur before click on some browsers
                                        e.preventDefault();
                                    }}
                                    onClick={() => onSelect(book)}
                                >
                                    <HStack justify="flex-start" align="center" gap="3" py="2">
                                        {book.coverUrl ? (
                                            <Image
                                                src={book.coverUrl + "?fife=w130-h130"}
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
                                            <Span fontWeight="medium" truncate>
                                                {book.title}
                                            </Span>
                                            <Span color="fg.muted" truncate>
                                                {book.authors?.join(", ")}
                                            </Span>
                                        </Box>
                                    </HStack>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))
                        ) : debounced ? (
                            <Span p="2" color="fg.muted">
                                Aucun résultat
                            </Span>
                        ) : (
                            <Span p="2" color="fg.muted">
                                Commencez à taper pour chercher
                            </Span>
                        )}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
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
