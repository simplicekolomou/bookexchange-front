import { useBookDetailController } from "./hooks/useBookDetailController";
import { BookDetailContent } from "./BookDetailContent.tsx";

export const BookDetailPage = () => {
    const { book, isLoading, isError, canBeSeen } = useBookDetailController();
    console.log("canBeSeen :" + canBeSeen);

    if (isLoading) return <p>Chargement…</p>;
    if (isError || !book) return <p>Livre introuvable</p>;
    if (!canBeSeen) return  <p>Ce livre ne vous est pas accessible</p>

    return <BookDetailContent book={book} />;
};

