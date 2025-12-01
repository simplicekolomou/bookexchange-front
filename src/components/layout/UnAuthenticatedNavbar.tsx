import { Box, Button, Flex } from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { RiArrowRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokens } from "../ui/theme";

export const UnAuthenticatedNavbar = () => {
    const { t } = useTranslation("common");

    const surfaceToken = tokens.colors.surface;
    const borderToken = tokens.colors.border;
    const textToken = tokens.colors.text;
    const primaryToken = tokens.colors.primary;
    const primaryHoverToken = tokens.colors.primaryHover;

    return (
        <Box
            as="nav"
            borderBottom="1px"
            borderColor={borderToken}
            bg={surfaceToken}
            position="sticky"
            top={0}
            color={textToken}
            borderRadius="lg"
            h={{ base: "64px", md: "72px" }}
            minH={{ base: "64px", md: "72px" }}
            zIndex={10}
            py={2}
        >
            <Flex
                maxW="1200px"
                mx="auto"
                px={{ base: 2, md: 3 }}
                h="100%"
                direction={{ base: "column", md: "row" }}
                align={{ base: "center", md: "center" }}
                justify="space-between"
                wrap="wrap"
                verticalAlign="center"
            >
                <Flex align="center" gap={1}>
                    <LogoWithText title={t("brand.title")} direction="row" />
                </Flex>

                <Flex
                    align="center"
                    mt={{ base: "auto", md: 0 }}
                >
                    <Link to="/login">
                        <Button
                            bg={primaryToken}
                            variant="outline"
                            color={"white"}
                            _hover={{ bg: primaryHoverToken, color: "white" }}
                        >
                            {t("actions.start")} <RiArrowRightLine style={{ marginLeft: 0 }} />
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
};