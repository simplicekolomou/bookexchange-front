import {BookForm} from "../components/BookForm.tsx";
import {Box, Container, Heading} from "@chakra-ui/react";
import {Toaster} from "../../../../components/ui/toaster.tsx";
import {useTranslation} from "react-i18next";

export const AddBookPage = () => {
    const { t } = useTranslation(["common", "addBook"]);

    return (
        <Box className="add-book-container">
            <Container maxW="4xl" py={8}>
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    {t("addBook:title")}
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
                    <BookForm mode="add"/>
                </Box>
            </Container>
            <Toaster/>
        </Box>
    );
}
