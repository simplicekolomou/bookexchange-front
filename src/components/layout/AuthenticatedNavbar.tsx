import { Box, Flex, Button, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { UserMenu } from "./UserMenu.tsx";
import { useTranslation } from "react-i18next";
import {LogoWithText} from "./LogoWithText.tsx";

interface NavbarProps {
    bookCount: number;
    title: string;
}

export const AuthenticatedNavbar = ({ title }: NavbarProps) => {
    const navigate = useNavigate();
    const showText = useBreakpointValue({ base: false, md: true }) ?? false;
    const { t } = useTranslation(["collections", "common"]);

    const handleSearchClick = () => navigate('/search');

    return (
        <Box borderBottom="1px" borderColor="gray.200" bg="whiteAlpha.800" backdropFilter="blur(10px)" position="sticky"
            top={0} zIndex={10} py={2} >
            <Flex maxW="1200px" mx="auto" px={4} direction="row" align="center" justify="space-between" gap={2} wrap="nowrap" >
                {/* Brand Section */}

                <LogoWithText title={title} direction={"row"} nbBooks={0}/>

                {/* Actions Section */}
                <Flex gap={2} align="center" wrap="nowrap">
                    <Button onClick={handleSearchClick} variant="outline" size="sm" minW="auto" px={2} >
                        <Search />
                        {showText && t("common:actions.search")}
                    </Button>

                    <Button
                        onClick={() => navigate('/add-book')}
                        colorScheme="blue" size="sm" minW="auto" px={2} >
                        <Plus className="navbar-icon" />
                        {showText && t("common:actions.add")}
                    </Button>
                    <UserMenu />
                </Flex>
            </Flex>
        </Box>
    );
};