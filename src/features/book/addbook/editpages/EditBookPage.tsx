import { useNavigate, useParams } from "react-router-dom";
import { useGetBookCopyQuery } from "../../api/bookApi.ts";
import { BookForm } from "../components/BookForm.tsx";
import {Box, Container, Heading} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

export const EditBookPage = () => {
    const {t} = useTranslation();
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
        <Box mb={5}>
            <Container maxW="4xl">
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    {t("addBook:editTitle")}
                </Heading>

                {/* Formulaire */}
                <Box
                    bg="white"
                    borderRadius="lg"
                    p={{ base: 4, md: 6 }}
                    boxShadow="sm"
                    border="1px"
                    borderColor="gray.100"
                >
                    <BookForm
                        mode="edit"
                        initialData={initialData}
                        onSubmitSuccess={() => {
                            navigate(`/${bookCopyId}/details`, { state: { reload: true }})
                        }}
                        bookId={Number(bookCopyId)}
                    />
                </Box>
            </Container>
        </Box>
    );
};
