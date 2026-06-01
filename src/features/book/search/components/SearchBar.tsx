import {Box, useBreakpointValue} from "@chakra-ui/react";
import { useState } from "react";
import type { BookCopy } from "../../types/book.types.ts";
import type { UserProfile } from "../../../profile/types/profile.types.ts";
import { SearchTabs } from "./SearchTabs.tsx";
import { SuggestionBox } from "./SuggestionBox.tsx";
import { BookCard } from "../../../../components/ui/BookCard.tsx";
import { UserCard } from "../../../../components/ui/UserCard.tsx";

type Props = {
    onSelect?: (item: BookCopy | UserProfile) => void;
};

export const SearchBar = ({ onSelect }: Props) => {
    const [searchType, setSearchType] = useState<"books" | "users">("books");
    const [selected, setSelected] = useState<BookCopy | UserProfile | null>(null);
    const viewMode = useBreakpointValue<"grid" | "list">({ base: "grid", md: "list" }) ?? "list";

    function handleSelectItem(item: BookCopy | UserProfile) {
        setSelected(item);
        if (onSelect) onSelect(item);
    }

    /**
     * Type guard pour vérifier si x est un UserProfile
     * @param x L'élément à vérifier
     * @returns true si x est un UserProfile, false sinon
     */
    function isUser(x: unknown): x is UserProfile {
        return typeof x === "object" && x !== null && ("firstName" in x || "lastName" in x);
    }

    return (
        <>
            <SearchTabs
                value={searchType}
                onChange={(v) => {
                    setSearchType(v as "books" | "users");
                    setSelected(null);
                }}
            />
            <Box position="relative">
                <SuggestionBox
                    key={searchType}
                    onSelectItem={handleSelectItem}
                    searchType={searchType}
                />
            </Box>

            {/* Affichage du BookCard ou UserCard lorsqu'un item est sélectionné */}
            <Box mt={4} w={"50%"} mx="auto" display="flex" justifyContent="center" alignItems="center">
                {selected ? (
                    isUser(selected) ? (
                        <UserCard user={selected} />
                    ) : (
                        <BookCard book={selected as BookCopy} viewMode={viewMode} />
                    )
                ) : null}
            </Box>
        </>
    );
};
