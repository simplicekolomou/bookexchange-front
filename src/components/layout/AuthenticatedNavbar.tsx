import { Box, Flex, Heading, Text, Button, useBreakpointValue } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Plus } from 'lucide-react';
import { UserMenu } from "./UserMenu.tsx";
import {useTranslation} from "react-i18next";

interface NavbarProps {
    bookCount: number;
    onAddBook: () => void;
    title: string;
}

export const AuthenticatedNavbar = ({ bookCount, onAddBook, title }: NavbarProps) => {
    const navigate = useNavigate();

    const showText = useBreakpointValue({ base: false, md: true }) ?? false;

    const handleSearchClick = () => navigate('/search');
    const handleAddClick = () => navigate('/search');
    const {t} = useTranslation(["collections", "common"]);

    return (
        <Box
            borderBottom="1px"
            borderColor="gray.200"
            bg="whiteAlpha.800"
            backdropFilter="blur(10px)"
            position="sticky"
            top={0}
            zIndex={10}
            py={2}
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
                {/* Brand Section */}
                <Flex align="center" gap={2}>
                    <Flex
                        w={8}
                        h={8}
                        bg="#D76542FF"
                        borderRadius="xl"
                        align="center"
                        justify="center"
                    >
                        <BookOpen size={20} color="white" />
                    </Flex>
                    <Box>
                        <Heading size="sm" color="gray.800">
                            {title}
                        </Heading>
                        <Text fontSize="xs" color="gray.600">
                            {bookCount} {t("collections:nbBooks")}
                        </Text>
                    </Box>
                </Flex>

                {/* Actions Section */}
                <Flex gap={2} align="center" wrap="nowrap">
                    <Button
                        onClick={handleSearchClick}
                        variant="outline"
                        size="sm"
                        minW="auto"
                        px={2}
                    >
                        <Search className="navbar-icon" />
                        {showText && t("common:actions.search")}
                    </Button>

                    <Button
                        onClick={onAddBook}
                        colorScheme="blue"
                        size="sm"
                        minW="auto"
                        px={2}
                    >
                        <Plus className="navbar-icon" />
                        {showText && t("common:actions.add")}
                    </Button>
                    <UserMenu />
                </Flex>
            </Flex>
        </Box>
    );
};