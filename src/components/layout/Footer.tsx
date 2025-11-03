import { Box, Container, Text } from "@chakra-ui/react";
import {LanguageSwitcher} from "./LanguageSwitcher.tsx";
import {useTranslation} from "react-i18next";

export const Footer = () => {
    const {t : tGlobal} = useTranslation("common");
    return (
        <Box as="footer" className="footer">
            <Container>
                <Text>© {new Date().getFullYear()} {tGlobal("brand.title")} - {tGlobal("brand.purpose")}</Text>
            </Container>
            <LanguageSwitcher/>
        </Box>
    );
};