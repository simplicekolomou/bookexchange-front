import { useParams } from "react-router-dom";
import {
    useGetBookCopyQuery, useGetBookOwnerQuery,
} from "../../api/bookApi.ts";
import type {UserProfile} from "../../../auth/profile/types/profile.types.ts";

export const useBookDetailController = () => {
    const { bookCopyId } = useParams();

    // Prevent invalid params from being used
    const copyId = Number(bookCopyId);
    const isValidCopyId = !isNaN(copyId);

    // Fetch the book copy (my or someone else’s logic can go here later)
    const myBookQuery = useGetBookCopyQuery(
        { copyId },
        { skip: !isValidCopyId }
    );

    // Extract ownerId once data is available
    const ownerId = myBookQuery.data?.ownerId ?? null;

    // Fetch the owner's profile (skipped until ownerId exists)
    const bookOwnerQuery = useGetBookOwnerQuery(
        { userId: ownerId! },
        { skip: !ownerId }
    );

    const authUser: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
    const isMyBook = Number(bookOwnerQuery.data?.id) == Number(authUser.id);

    return {
        book: myBookQuery.data,
        owner: bookOwnerQuery.data,
        isUserOwner: isMyBook,
        isLoading: myBookQuery.isLoading || bookOwnerQuery.isLoading,
        isError: myBookQuery.isError || bookOwnerQuery.isError,
    };
};
