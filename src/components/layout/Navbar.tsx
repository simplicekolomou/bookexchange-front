import { Box, Flex, Button, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Plus, BookOpen, Send, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText";
import { UserMenu } from "./UserMenu";
import {useAppSelector} from "../../app/hooks.ts";
import {useGetMyBooksQuery} from "../../features/book/bookApi.ts";

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation(["common", "collections"]);

    // Auth depuis le store
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const user = useAppSelector((state) => state.auth.user);

    // Nombre de livres (uniquement si connecté)
    const { data: books = [] } = useGetMyBooksQuery(undefined, {
        skip: !isAuthenticated,
    });

    // Visibilité du texte selon la taille d'écran
    const showText = useBreakpointValue({ base: false, md: true }) ?? false;

    // Boutons visibles uniquement pour les utilisateurs connectés
    const renderAuthenticatedButtons = () => {
        const pathname = location.pathname;
        const buttons = [];

        if (!pathname.endsWith("/search")) {
            buttons.push(
                <Button key="search" onClick={() => navigate("/search")} variant="solid">
                    <Search size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.search")}</Box>}
                </Button>
            );
        }

        if (!pathname.endsWith("/add-book")) {
            buttons.push(
                <Button key="add" onClick={() => navigate("/add-book")} variant="solid">
                    <Plus size={16} />
                    {showText && <Box as="span" ms={2}>{t("common:actions.add")}</Box>}
                </Button>
            );
        }

        if (user && !pathname.endsWith("/collection")) {
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

        if (pathname !== "/dms") {
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
                {/* Logo + titre (le nombre de livres est donné si connecté) */}
                <LogoWithText
                    title={t("common:brand.title")}
                    direction="row"
                    nbBooks={isAuthenticated ? books.length : undefined}
                />

                {/* Partie droite : boutons d'action + menu utilisateur (si connecté) */}
                <Flex gap={2} align="center" wrap="nowrap">
                    {isAuthenticated ? (
                        <>
                            {renderAuthenticatedButtons()}
                            <UserMenu />
                        </>
                    ) : (
                        <Button
                            variant="solid"
                            onClick={() => navigate("/login")}
                        >
                            {t("common:actions.start")} <LogIn size={16} style={{ marginLeft: 8 }} />
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};