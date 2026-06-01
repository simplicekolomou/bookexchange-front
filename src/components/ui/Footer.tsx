import { Box, Container, Text, Flex } from "@chakra-ui/react";
import { LanguageSwitcher } from "./LanguageSwitcher.tsx";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme/theme.ts";

export const Footer = () => {
    const { t: tGlobal } = useTranslation("common");

    return (
        <Box
            as="footer"
            role="contentinfo"
            bg={tokens.colors.surface}
            color={tokens.colors.textMuted}
            borderTop="1px"
            borderColor={tokens.colors.border}
            py={{ base: 4, md: 6 }}
            px={{ base: 4, md: 6 }}
            alignItems={"center"}
        >
            <Container
                maxW="1200px"
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                px={0}
            >
                <Text fontSize="sm">
                    © {new Date().getFullYear()} {tGlobal("brand.title")} - {tGlobal("brand.purpose")}
                </Text>

                <Flex align="center" gap={3}>
                    <LanguageSwitcher />
                </Flex>
            </Container>
        </Box>
    );
};
