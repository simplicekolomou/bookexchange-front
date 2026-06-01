import { Box, Flex, Button, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, Send, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import { useGetMyBooksQuery } from "../../features/book/api/bookApi.ts";
import type {User} from "../../features/auth/types/auth.types.ts";

export const Navbar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(["common", "collections"]);
    const pathname = window.location.pathname;
    const isAuthenticated = true;

    const user: User = localStorage.getItem("auth_user") as unknown as User;

    console.log("user", user);

    const { data: books = [] } = useGetMyBooksQuery(undefined, {
        skip: !isAuthenticated,
    });

    const showText = useBreakpointValue({ base: false, md: true }) ?? false;

    // Boutons affichés UNIQUEMENT si l'utilisateur est connecté
    const renderAuthenticatedButtons = () => {
        const buttons = [];

        if (user && !pathname.startsWith("/search")) {
            buttons.push(
                <Button key="search" onClick={() => navigate("/search")} variant="solid">
                    <Search size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.search")}</Box>}
                </Button>
            );
        }

        if (user && !pathname.startsWith("/add-book")) {
            buttons.push(
                <Button key="add" onClick={() => navigate("/add-book")} variant="solid">
                    <Plus size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.add")}</Box>}
                </Button>
            );
        }

        if (user && !pathname.startsWith(`/user/${user.id}/collection`)) {
            buttons.push(
                <Button
                    key="collection"
                    variant="solid"
                    onClick={() => navigate(`/user/${user.id}/collection`)}
                >
                    <BookOpen size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.collection")}</Box>}
                </Button>
            );
        }

        if (user && !pathname.startsWith("/dms")) {
            buttons.push(
                <Button
                    key="dms"
                    onClick={() => navigate("/dms")}
                    size="sm"
                    minW="auto"
                    px={3}
                    bg="colorPalette.default"
                    _hover={{ bg: "colorPalette.emphasized" }}
                >
                    <Send size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.dms")}</Box>}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Box
            as="nav"
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
            <Flex
                maxW="1200px"
                mx="auto"
                px={4}
                direction="row"
                align="center"
                justify="space-between"
                gap={2}
                wrap="nowrap"
            >
                <LogoWithText
                    title={t("common:brand.title")}
                    direction="row"
                    nbBooks={isAuthenticated ? books.length : undefined}
                />

                <Flex gap={2} align="center" wrap="nowrap">
                    {isAuthenticated ? (
                        <>
                            {renderAuthenticatedButtons()}
                            <UserMenu />
                        </>
                    ) : (
                        <Button variant="solid" onClick={() => navigate("/login")}>
                            {t("common:actions.start")} <LogIn size={16} style={{ marginLeft: 8 }} />
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};