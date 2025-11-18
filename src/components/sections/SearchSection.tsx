import {AuthenticatedNavbar} from "../layout/AuthenticatedNavbar.tsx";
import {useTranslation} from "react-i18next";
import {Box} from "@chakra-ui/react";

export const SearchSection = () => {
    const {t} = useTranslation("collections");
    return (
        <Box minH="100vh" bg="gray.50">
            <AuthenticatedNavbar
                title={t("title")}
                bookCount={0}
                onAddBook={function(): void {
                throw new Error("Function not implemented.");
            } } />
        </Box>
    );
}