import { Box, Button, Flex } from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { RiArrowRightLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const UnAuthenticatedNavbar = () => {
    const { t } = useTranslation("common");

    return (
        <Box borderBottom="1px" borderColor="gray.200" bg="whiteAlpha.800" backdropFilter="blur(10px)" position="sticky"
            top={0} zIndex={10} py={2} >
            <Flex maxW="1200px" mx="auto" px={4} direction={{ base: "column", md: "row" }} align={{ base: "flex-start", md: "center" }}
                justify="space-between" gap={4} wrap="wrap" >
                {/* Brand Section */}
                <Flex align="center" gap={2}>
                    <LogoWithText title={t("brand.title")} direction="row" />
                </Flex>

                {/* Actions Section */}
                <Flex gap={2} align="center" wrap="wrap">
                    <Link to="/login">
                        <Button size="sm" variant="outline">
                            {t("actions.start")} <RiArrowRightLine />
                        </Button>
                    </Link>
                </Flex>
            </Flex>
        </Box>
    );
};