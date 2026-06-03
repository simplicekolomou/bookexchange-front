import { Box } from "@chakra-ui/react";
import type { BookCopy } from "../../types/book.types.ts";
import type { UserProfile } from "../../../profile/types/profile.types.ts";
import { SearchTabs } from "./SearchTabs.tsx";
import { SuggestionBox } from "./SuggestionBox.tsx";
import { BookCard } from "../../../../components/ui/BookCard.tsx";
import { UserCard } from "../../../../components/ui/UserCard.tsx";
import {useSearchController} from "../hooks/useSearchController.ts";

type Props = {
    onSelect?: (item: BookCopy | UserProfile) => void;
};

export const SearchBar = ({ onSelect }: Props) => {
    const {
        searchType,
        selected,
        viewMode,
        handleSelectItem,
        handleSearchTypeChange,
        isUser,
    } = useSearchController(onSelect);

    return (
        <>
            <SearchTabs
                value={searchType}
                onChange={handleSearchTypeChange}
            />
            <Box position="relative">
                <SuggestionBox
                    key={searchType}
                    onSelectItem={handleSelectItem}
                    searchType={searchType}
                />
            </Box>

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