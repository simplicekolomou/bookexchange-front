import { useParams } from "react-router-dom";
import { useGetMyBooksQuery, useGetUserBooksQuery } from "../../../../features/book/bookApi.ts";
import { useMemo, useState } from "react";
import type {UserProfile} from "../../../../types/profile.types.ts";

export const useCollectionController = () => {
    const { userId } = useParams();
    const user: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
    const isMyCollection = userId == user.id;

    console.log("IsMyCollection ?: " + isMyCollection);

    // Always call both hooks
    const myBooksQuery = useGetMyBooksQuery(undefined, {
        skip: !isMyCollection,
    });

    const userBooksQuery = useGetUserBooksQuery(
        { userId: Number(userId) },
        {
            skip: isMyCollection,
        }
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

    return {
        isMyCollection,
        books: filteredBooks,
        searchQuery,
        setSearchQuery,
        viewMode,
        setViewMode,
        filter,
        setFilter,
        isLoading,
        isError,
    };
};
