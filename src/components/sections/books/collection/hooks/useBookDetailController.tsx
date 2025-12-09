import { useParams } from "react-router-dom";
import {
    useGetBookCopyQuery, useGetBookOwnerQuery,
} from "../../../../../features/book/bookApi.ts";
import type {UserProfile} from "../../../../../types/profile.types.ts";

export const useBookDetailController = () => {
    const { bookCopyId } = useParams();

    // Prevent invalid params from being used
    const copyId = Number(bookCopyId);

    console.log("bookCopyId: " + bookCopyId);

    const isValidCopyId = !isNaN(copyId);

    console.log("isValidCopyId: " + isValidCopyId);

    // 1️⃣ Fetch the book copy (my or someone else’s logic can go here later)
    const myBookQuery = useGetBookCopyQuery(
        { copyId },
        { skip: !isValidCopyId }
    );

    // 2️⃣ Extract ownerId once data is available
    const ownerId = myBookQuery.data?.ownerId ?? null;
    console.log("ownerId: " + ownerId);

    // 3️⃣ Fetch the owner's profile (skipped until ownerId exists)
    const bookOwnerQuery = useGetBookOwnerQuery(
        { userId: ownerId! },
        { skip: !ownerId }
    );

    console.log("bookOwnerQuery: ");
    console.log(bookOwnerQuery.data);

    const authUser: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
    const isMyBook = Number(bookOwnerQuery.data?.id) == Number(authUser.id);
    console.log("isMyBook: " + isMyBook);

    return {
        book: myBookQuery.data,
        owner: bookOwnerQuery.data,
        isUserOwner: isMyBook,
        isLoading: myBookQuery.isLoading || bookOwnerQuery.isLoading,
        isError: myBookQuery.isError || bookOwnerQuery.isError,
    };
};
