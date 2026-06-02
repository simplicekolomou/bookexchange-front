import {BookForm} from "../components/BookForm.tsx";
import {Box, Container, Heading} from "@chakra-ui/react";
import {Toaster} from "../../../../components/ui/toaster.tsx";
import {useTranslation} from "react-i18next";

export const AddBookPage = () => {
    const { t } = useTranslation(["common", "addBook"]);

    return (
        <Box mb={5}>
            <Container maxW="4xl">
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="5" pt="5">
                    {t("addBook:addTitle")}
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
