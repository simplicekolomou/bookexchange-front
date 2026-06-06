import { useGetMyBooksQuery, useGetUserBooksQuery } from "../../api/bookApi.ts";
import { useMemo, useState } from "react";
import {useBreakpointValue} from "@chakra-ui/react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../auth/authSlice.ts";
import type {User} from "../../../auth/types/auth.types.ts";

export const useCollectionController = () => {
    const user: User | null | undefined = useSelector(selectCurrentUser);
    const isMyCollection = Number(user?.id) == Number(user?.id);

    const myBooksQuery = useGetMyBooksQuery(
        undefined,
        { skip: !isMyCollection, }
    );

    const userBooksQuery = useGetUserBooksQuery(
        { userId: Number(user?.id) },
        { skip: isMyCollection, }
    );

    const isLoading = isMyCollection
        ? myBooksQuery.isLoading
        : userBooksQuery.isLoading;

    const isError = isMyCollection
        ? myBooksQuery.isError
        : userBooksQuery.isError;

    // Local UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [filter, setFilter] = useState<"all" | "available">("all");

    const filteredBooks = useMemo(() => {
        // Select the relevant result
        const books = isMyCollection
            ? myBooksQuery.data ?? []
            : userBooksQuery.data ?? [];

        const q = searchQuery.toLowerCase();
        return books.filter((book: { title: string; authors: string[]; availabilityType: string; }) => {
            const matchSearch =
                book.title.toLowerCase().includes(q) ||
                book.authors.some((a: string) => a.toLowerCase().includes(q));

            const matchFilter =
                filter === "all" || book.availabilityType !== "NONE";

            return matchSearch && matchFilter;
        });
    },
        [
            isMyCollection,
            myBooksQuery.data,
            userBooksQuery.data,
            searchQuery,
            filter
        ]
    );

    const gridColumns = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4 });

    return {
        isMyCollection,
        filteredBooks,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        isLoading,
        isError,
        gridColumns,
    };
};
