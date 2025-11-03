import { Box, Container, Text } from "@chakra-ui/react";
import {LanguageSwitcher} from "./LanguageSwitcher.tsx";

export const Footer = () => {
    return (
        <Box as="footer" className="footer">
            <Container>
                <Text>© 2025 BookSwap - Plateforme d'échange de livres</Text>
            </Container>
            <LanguageSwitcher/>
        </Box>
    );
};