import { useState, } from 'react';
import { Box, Container, Drawer, useDisclosure } from '@chakra-ui/react';
import { SearchTabs } from './SearchTabs.tsx';
import { SearchBar } from './SectionSearchBar.tsx';
import { AdvancedFilters } from './AdvancedFilters';
import {BookDetail} from "./BookDetail.tsx";

export const SearchSection = ()=> {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState('books');
    const [advancedFilters, setAdvancedFilters] = useState({
        author: '',
        isbn: '',
        condition: '',
        availability: '',
        location: '',
    });

    const { onOpen: onFiltersOpen, onClose: onFiltersClose } = useDisclosure();


    const clearFilters = () => {
        setAdvancedFilters({
            author: '',
            isbn: '',
            condition: '',
            availability: '',
            location: '',
        });
    };

    const hasActiveFilters = Object.values(advancedFilters).some((v) => v !== '');

    return (
        <Box minH="100vh">

            <Container maxW="4xl" py={8}>
                <SearchTabs value={searchType} onChange={setSearchType} />

                <SearchBar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onFiltersOpen={onFiltersOpen}
                    activeFiltersCount={hasActiveFilters ? Object.values(advancedFilters).filter(v => v !== '').length : 0}
                />

                <AdvancedFilters
                    onClose={onFiltersClose}
                    filters={advancedFilters}
                    onFiltersChange={setAdvancedFilters}
                    onClearFilters={clearFilters}
                    searchType={searchType}
                    hasActiveFilters={hasActiveFilters} isOpen={false} />

                {searchType === 'books' ? (
                    <div></div>
                    //<BookResults books={filteredBooks} onBookSelect={handleBookSelect} />
                ) : (
                    <div></div>
                    //<UserResults users={filteredUsers} onUserSelect={handleUserSelect} />
                )}
            </Container>

            {/* Modal de détail du livre */}
            <Drawer.Root placement={"end"} size="lg">
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Drawer.Title>Détails du livre</Drawer.Title>
                            <Drawer.CloseTrigger />
                        </Drawer.Header>
                        <Drawer.Body>
                            {/* Contenu du détail du livre */}
                                <BookDetail
                                />
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Box>
    );
}