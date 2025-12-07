import { type JSX } from "react";
import { Box, Flex, Button, useBreakpointValue, Box as ChakraBox } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen } from "lucide-react";
import { UserMenu } from "./UserMenu.tsx";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText.tsx";

interface NavbarProps {
    bookCount: number;
    title: string;
}

export const AuthenticatedNavbar = ({ title }: NavbarProps) => {
    const navigate = useNavigate();
    const showText = useBreakpointValue({ base: false, md: true }) ?? false;
    const { t } = useTranslation(["collections", "common"]);

    const renderActionButtons = () => {
        const pathname = typeof window !== "undefined" ? window.location.pathname : "";

        const buttons: JSX.Element[] = [];

        if (pathname !== "/search") {
            buttons.push(
                <Button
                    key="search"
                    onClick={() => navigate("/search")}
                    variant="solid"
                >
                    <Search size={16} />
                    {showText && <ChakraBox as="span" ms={2}>{t("common:actions.search")}</ChakraBox>}
                </Button>
            );
        }

        if (pathname !== "/add-book") {
            buttons.push(
                <Button
                    key="add"
                    onClick={() => navigate("/add-book")}
                    variant="solid"
                >
                    <Plus size={16} />
                    {showText && <ChakraBox as="span" ms={2}>{t("common:actions.add")}</ChakraBox>}
                </Button>
            );
        }

        if (pathname !== "/collection") {
            buttons.push(
                <Button
                    variant="solid"
                    key="collection"
                    onClick={() => navigate("/collection")}
                >
                    <BookOpen size={16} />
                    {showText && <ChakraBox as="span" ms={2}>{t("common:actions.collection")}</ChakraBox>}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Box
            borderBottomWidth="1px"
            borderBottomColor="border.default"
            bg="bg.surface"
            color="fg.default"
            position="sticky"
            top={0}
            zIndex={10}
            py={2}
            borderRadius="md"
        >
            <Flex maxW="1200px" mx="auto" px={4} direction="row" align="center" justify="space-between" gap={2} wrap="nowrap">
                <LogoWithText title={title} direction={"row"} nbBooks={0} />

                <Flex gap={2} align="center" wrap="nowrap">
                    {renderActionButtons()}
                    <UserMenu />
                </Flex>
            </Flex>
        </Box>
    );
};
