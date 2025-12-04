import { useParams } from "react-router-dom";
import {
    useGetMyBookCopyQuery,
    useGetUserBookCopyQuery
} from "../../../../features/book/bookApi";
import type {BookCopy} from "../../../../types/book.types.ts";
import type {UserProfile} from "../../../../types/profile.types.ts";

export const useBookDetailController = () => {
    const { userId, bookCopyId } = useParams();

    // Prevent invalid params from being used
    const copyId = Number(bookCopyId);
    const ownerId = Number(userId);

    console.log("bookCopyId: " + bookCopyId);

    const authUser: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
    const isMyBook = Number(userId) == Number(authUser.id);

    const isValidCopyId = !isNaN(copyId);
    const isValidUserId = !isNaN(ownerId);

    console.log("isValidCopyId: " + isValidCopyId);

    // ❗ Hooks must ALWAYS be called
    const myBookQuery = useGetMyBookCopyQuery(
        { copyId },
        { skip: !isMyBook || !isValidCopyId }
    );

    const userBookQuery = useGetUserBookCopyQuery(
        { userId: ownerId, copyId },
        { skip: isMyBook || !isValidCopyId || !isValidUserId }
    );

    console.log("isMyBook: " + isMyBook);
    // Choose which query is active
    const active = isMyBook ? myBookQuery : userBookQuery;
    console.log(active);

    const book: BookCopy | undefined = Array.isArray(active.data) ? active.data[0] : active.data;
    if (book?.availabilityType == "NONE" && !isMyBook) {
        return  {
            book: null,
            isLoading: active.isLoading,
            isError: active.isError,
            canBeSeen: false
        }
    } else {
        return {
            book: Array.isArray(active.data) ? active.data[0] : active.data,
            isLoading: active.isLoading,
            isError: active.isError,
            canBeSeen: true,
        };
    }
};
