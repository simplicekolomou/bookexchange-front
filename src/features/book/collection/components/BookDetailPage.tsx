import { useBookDetailController } from "../hooks/useBookDetailController.tsx";
import { BookDetailContent } from "./BookDetailContent.tsx";

export const BookDetailPage = () => {
    const { book, owner, isUserOwner, isLoading, isError} = useBookDetailController();

    if (isLoading) return <p>Chargement…</p>;
    if (isError || !book) return <p>Livre introuvable</p>;

    return <BookDetailContent book={book} owner={owner} isUserOwner={isUserOwner} />;
};

