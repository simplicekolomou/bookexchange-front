import {type JSX} from 'react';
import { Box, Flex, Button, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, BookOpen } from 'lucide-react';
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
        // Récupérer le pathname de la fenêtre actuelle
        const pathname = (typeof window !== "undefined") ? window.location.pathname : "";

        const buttons: JSX.Element[] = [];

        if (pathname !== "/search") {
            buttons.push(
                <Button key="search" onClick={() => navigate('/search')} variant="outline" size="sm" minW="auto" px={2}>
                    <Search />
                    {showText && t("common:actions.search")}
                </Button>
            );
        }

        if (pathname !== "/add-book") {
            buttons.push(
                <Button key="add" onClick={() => navigate('/add-book')} colorScheme="blue" size="sm" minW="auto" px={2}>
                    <Plus className="navbar-icon" />
                    {showText && t("common:actions.add")}
                </Button>
            );
        }

        if (pathname !== "/collection") {
            buttons.push(
                <Button key="collection" onClick={() => navigate('/collection')} colorScheme="blue" size="sm" minW="auto" px={2}>
                    <BookOpen className="navbar-icon" />
                    {showText && t("common:actions.collection")}
                </Button>
            );
        }

        return buttons;
    };

    return (
        <Box borderBottom="1px" borderColor="gray.200" bg="whiteAlpha.800" backdropFilter="blur(10px)" position="sticky"
             top={0} zIndex={10} py={2} borderRadius="lg">
            <Flex maxW="1200px" mx="auto" px={4} direction="row" align="center" justify="space-between" gap={2} wrap="nowrap" >
                <LogoWithText title={title} direction={"row"} nbBooks={0}/>

                <Flex gap={2} align="center" wrap="nowrap">
                    {renderActionButtons()}
                    <UserMenu />
                </Flex>
            </Flex>
        </Box>
    );
};
