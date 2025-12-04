import { type JSX } from "react";
import { Box, Flex, Button, useBreakpointValue, Box as ChakraBox } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen } from "lucide-react";
import { UserMenu } from "./UserMenu.tsx";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText.tsx";
import type {UserProfile} from "../../types/profile.types.ts";

interface NavbarProps {
    bookCount: number;
    title: string;
}

export const AuthenticatedNavbar = ({ title }: NavbarProps) => {
    const navigate = useNavigate();
    // Utilisé pour la navigation vers la collection
    const user: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
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
                    variant="outline"
                    size="sm"
                    minW="auto"
                    px={3}
                    borderColor="colorPalette.default"
                    color="colorPalette.default"
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
                    size="sm"
                    minW="auto"
                    px={3}
                    bg="colorPalette.default"
                    color="white"
                    _hover={{ bg: "colorPalette.emphasized" }}
                >
                    <Plus size={16} />
                    {showText && <ChakraBox as="span" ms={2}>{t("common:actions.add")}</ChakraBox>}
                </Button>
            );
        }

        if (!pathname.endsWith("/collection")) {
            buttons.push(
                <Button
                    key="collection"
                    onClick={() => navigate(`/user/${user.id}/collection`)}
                    size="sm"
                    minW="auto"
                    px={3}
                    bg="colorPalette.default"
                    color="white"
                    _hover={{ bg: "colorPalette.emphasized" }}
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
