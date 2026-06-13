import { Box, Flex, Button, useBreakpointValue } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, BookOpen, Send, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import { useGetMyBooksQuery } from "../../features/book/api/bookApi.ts";
import { useSelector } from "react-redux";
import {
    selectCurrentUser,
    selectIsAuthenticated,
} from "../../features/auth/authSlice.ts";

export const Navbar = () => {
    const navigate = useNavigate();
    const { t } = useTranslation(["common", "collections"]);
    const pathname = window.location.pathname;

    // User et isAuthenticated depuis authSlice
    const user = useSelector(selectCurrentUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);

    const { data: books = [] } = useGetMyBooksQuery(undefined, {
        skip: !isAuthenticated,
    });

    const showText = useBreakpointValue({ base: false, md: true }) ?? false;

    const navButtons = [
        {
            key: "search",
            path: "/search",
            icon: <Search size={16} />,
            label: t("common:actions.search"),
            hide: pathname.startsWith("/search"),
        },
        {
            key: "add",
            path: "/add-book",
            icon: <Plus size={16} />,
            label: t("common:actions.add"),
            hide: pathname.startsWith("/add-book"),
        },
        {
            key: "collection",
            path: `/user/${user?.id}/collection`,
            icon: <BookOpen size={16} />,
            label: t("common:actions.collection"),
            hide: pathname.startsWith(`/user/${user?.id}/collection`),
        },
        {
            key: "dms",
            path: `/user/${user?.id}/dms`,
            icon: <Send size={16} />,
            label: t("common:actions.dms"),
            hide: pathname.startsWith("/dms"),
            // Style distinct pour le bouton DMs
            bg: "colorPalette.default",
            hoverBg: "colorPalette.emphasized",
        },
    ];

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
                            {/* Boutons filtrés proprement */}
                            {navButtons
                                .filter((btn) => !btn.hide)
                                .map(({ key, path, icon, label, bg, hoverBg }) => (
                                    <Button
                                        key={key}
                                        onClick={() => navigate(path)}
                                        variant="solid"
                                        size="sm"
                                        minW="auto"
                                        px={3}
                                        {...(bg ? { bg, _hover: { bg: hoverBg } } : {})}
                                    >
                                        {icon}
                                        {showText && <Box as="span" ms={2}>{label}</Box>}
                                    </Button>
                                ))}
                            <UserMenu />
                        </>
                    ) : (
                        <Button variant="solid" onClick={() => navigate("/login")}>
                            {t("common:actions.start")}
                            <LogIn size={16} style={{ marginLeft: 8 }} />
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
};