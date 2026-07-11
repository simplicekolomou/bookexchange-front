import type {BookCopy} from "../../types/book.types.ts";
import type {UserProfile} from "../../../auth/profile/types/profile.types.ts";
import { useState } from "react";
import { useBreakpointValue } from "@chakra-ui/react";
export const useSearchController = (onSelect?: (item: BookCopy | UserProfile)=> void) =>{
    const [searchType, setSearchType]= useState<"books" | "users">("books");
    const [selected, setSelected] = useState<BookCopy | UserProfile | null>(null);
    const viewMode = useBreakpointValue<"grid" | "list">({ base: "grid", md: "list" }) ?? "list";

    const handleSelectItem = (item: BookCopy | UserProfile) =>{
        setSelected(item);
        onSelect?.(item);
    }

    const handleSearchTypeChange = (v: string) =>{
        setSearchType(v as "books" | "users");
        setSelected(null);
    }

    /**
     * Type guard pour déterminer si le résultat sélectionné est un UserProfile ou un BookCopy
     * Stratégie : vérifier la présence de propriétés spécifiques(email) et à la fois l'absence de propriétés
     * spécifiques(isbn) pour différencier les deux types
     * @param x - l'item sélectionné qui peut être soit un BookCopy, soit un UserProfile, ou null/undefined
     * @returns true si x est un UserProfile, false sinon
     */
    const isUser = (x: BookCopy | UserProfile | null | undefined): x is UserProfile => {
        return x !== null && typeof x === "object" && "email" in x && !("isbn" in x);
    };

    return {
        searchType,
        selected,
        viewMode,
        handleSelectItem,
        handleSearchTypeChange,
        isUser,
    }
}