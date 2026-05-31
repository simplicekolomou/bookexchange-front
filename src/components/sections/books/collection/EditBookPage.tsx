import { useNavigate, useParams } from "react-router-dom";
import { useGetBookCopyQuery } from "../../../../features/book/api/bookApi.ts";
import { BookForm } from "../../../../features/book/addbook/components/BookForm.tsx";

export const EditBookPage = () => {
    const navigate = useNavigate();
    const { bookCopyId } = useParams();

    const { data, isLoading, isError } = useGetBookCopyQuery({
        copyId: Number(bookCopyId),
    });

    if (isLoading) return <p>Loading…</p>;
    if (isError || !data) return <p>Book not found.</p>;

    const initialData = {
        id: data.id,
        title: data.title,
        authors: data.authors.map(a => ({ name: a })),
        isbns: data.isbn,
        bookState: data.physicalState,
        format: data.format,
        edition: data.edition,
        coverImage: data.coverPictureApiUrl,
        description: data.description,
        availability: data.availabilityType,
        isAvailable: data.availabilityType !== "NONE",
    };

    return (
        <BookForm
            mode="edit"
            initialData={initialData}
            onSubmitSuccess={() => {
                navigate(`/bookCopy/${bookCopyId}`, { state: { reload: true }})
            }}
            bookId={Number(bookCopyId)}
        />
    );
};
