import { Box, Flex, Input, Button, SimpleGrid, VStack, Text, useBreakpointValue } from '@chakra-ui/react';
import type { Book } from '../../types/book';
import { BookCard } from '../layout/BookCard';
import { Search, BookOpen, Grid3x3, List } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface CollectionContentProps {
    books: Book[];
    searchQuery: string;
    viewMode: 'grid' | 'list';
    filter: 'all' | 'available';
    onSearchChange: (query: string) => void;
    onViewModeChange: (mode: 'grid' | 'list') => void;
    onFilterChange: (filter: 'all' | 'available') => void;
}

export const CollectionContent = ({
                                      books,
                                      searchQuery,
                                      viewMode,
                                      filter,
                                      onSearchChange,
                                      onViewModeChange,
                                      onFilterChange,
                                  }: CollectionContentProps) => {
    const gridColumns = useBreakpointValue({
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
    });

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || book.availability !== 'none';
        return matchesSearch && matchesFilter;
    });

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e.target.value);
    };

    const { t } = useTranslation("collections");

    return (
        <Box maxW="1200px" mx="auto" px={4} py={8}>
            {/* Controle Section */}
            <Flex
                gap={4}
                mb={8}
                direction={{ base: 'column', lg: 'row' }}
                justify="center"
                w="full"
            >
                {/* Search Input avec icône positionnée */}
                <Box position="relative" w="full" maxW={{ base: "full", md: "400px" }}>
                    <Search
                        size={20}
                        color="var(--chakra-colors-gray-400)"
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            zIndex: 1
                        }}
                    />
                    <Input
                        placeholder={t("searchPlaceholder")}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                        bg="white"
                        pl="40px"
                        size="lg"
                        borderRadius="md"
                    />
                </Box>

                <Flex
                    gap={4}
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'stretch', sm: 'center' }}
                    w="max"
                    justify="center"
                    flexWrap="wrap"
                >
                    {/* Boutons de filtre */}
                    <Flex gap={4}>
                        <Button
                            onClick={() => onFilterChange('all')}
                            colorScheme={filter === 'all' ? 'blue' : 'gray'}
                            variant={filter === 'all' ? 'solid' : 'outline'}
                        >
                            {t("allBooks")}
                        </Button>
                        <Button
                            onClick={() => onFilterChange('available')}
                            colorScheme={filter === 'available' ? 'blue' : 'gray'}
                            variant={filter === 'available' ? 'solid' : 'outline'}
                        >
                            {t("availableBooks")}
                        </Button>
                    </Flex>
                    {/* Bouton Mode vue */}
                    <Flex gap={2}>
                        <Button
                            aria-label="Vue grille"
                            colorScheme={viewMode === 'grid' ? 'blue' : 'gray'}
                            variant={viewMode === 'grid' ? 'solid' : 'outline'}
                            onClick={() => onViewModeChange('grid')}
                        >
                            <Grid3x3 />
                        </Button>
                        <Button
                            aria-label="Vue liste"
                            colorScheme={viewMode === 'list' ? 'blue' : 'gray'}
                            variant={viewMode === 'list' ? 'solid' : 'outline'}
                            onClick={() => onViewModeChange('list')}
                        >
                            <List />
                        </Button>
                    </Flex>
                </Flex>
            </Flex>

            {/* Books Grid/List */}
            {filteredBooks.length === 0 ? (
                <EmptyCollection t={t} />
            ) : viewMode === 'grid' ? (
                <SimpleGrid
                    columns={gridColumns}
                    gap={4}
                    w="full"
                >
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            viewMode={viewMode}
                        />
                    ))}
                </SimpleGrid>
            ) : (
                <VStack gap={3} w="full">
                    {filteredBooks.map((book) => (
                        <BookCard
                            key={book.id}
                            book={book}
                            viewMode={viewMode}
                        />
                    ))}
                </VStack>
            )}
        </Box>
    );
};

const EmptyCollection = ({ t }: { t: (key: string) => string }) => (
    <VStack gap={6} py={16} textAlign="center" maxW="400px" mx="auto">
        <Flex
            w={20}
            h={20}
            bg="gray.100"
            borderRadius="full"
            align="center"
            justify="center"
        >
            <BookOpen size={40} color="var(--chakra-colors-gray-400)" />
        </Flex>
        <Box>
            <Text fontSize="2xl" fontWeight="semibold" color="gray.800" mb={2}>
                {t("emptyList")}
            </Text>
            <Text color="gray.600" mb={6}>
                {t("slogan")}
            </Text>
        </Box>
        <Button
            colorScheme="blue"
            size="lg"
            w={{ base: "full", sm: "auto" }}
        >
            {t("addButton")}
        </Button>
    </VStack>
);