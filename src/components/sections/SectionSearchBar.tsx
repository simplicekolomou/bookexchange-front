import { Box, Input, Button, Badge, Flex } from '@chakra-ui/react';
import { Search as SearchIcon, SlidersHorizontal } from 'lucide-react';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onFiltersOpen: () => void;
    activeFiltersCount: number;
}

export const SearchBar = ({
                              searchQuery,
                              onSearchChange,
                              onFiltersOpen,
                              activeFiltersCount
                          }: SearchBarProps) => {
    return (
        <Flex gap={2} mb={6} direction={{ base: 'column', sm: 'row' }} bg={"black"}>
            <Box position="relative" flex={1}>
                <SearchIcon
                    size={20}
                    color="var(--chakra-colors-gray-400)"
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)'
                    }}
                />
                <Input
                    type="text"
                    placeholder="Rechercher par titre..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    pl="40px"
                    size="lg"
                />
            </Box>

            <Button
                variant="outline"
                onClick={onFiltersOpen}
                size="lg"
                gap={2}
            >
                <SlidersHorizontal size={16} />
                Filtres avancés
                {activeFiltersCount > 0 && (
                    <Badge colorScheme="blue" ml={2}>
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>
        </Flex>
    );
};