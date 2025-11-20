import { useState, useMemo } from 'react';
import type { BookTypes } from '../../types/book.types.ts';
import { Box, Container, Drawer, useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { SearchTabs } from './SearchTabs.tsx';
import { SearchBar } from './SectionSearchBar.tsx';
import { AdvancedFilters } from './AdvancedFilters';
import { BookResults } from './BookResults';
import { UserResults } from './UserResults';
import {BookDetail} from "./BookDetail.tsx";
import {useTranslation} from "react-i18next";
import type {UserProfile} from "../../types/user.types";

export const SearchSection = ()=> {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchType, setSearchType] = useState<'books' | 'users'>('books');
    const [selectedBook, setSelectedBook] = useState<{ book: BookTypes; owner: UserProfile } | null>(null);
    const [advancedFilters, setAdvancedFilters] = useState({
        author: '',
        isbn: '',
        condition: '',
        availability: '',
        location: '',
    });

    const navigate = useNavigate();
    const { onOpen: onFiltersOpen, onClose: onFiltersClose } = useDisclosure();
    const { onOpen: onBookModalOpen } = useDisclosure();

    const availableBooks = useMemo(() => {
        const user: UserProfile = JSON.parse(localStorage.getItem('users') || '[]');
        const allBooksFromStorage: BookTypes[] = JSON.parse(localStorage.getItem('books') || '[]');
        const result: { book: BookTypes; owner: UserProfile }[] = [];

        allBooksFromStorage.forEach((book) => {
            if (book.availability !== 'none') {
                const owner = users.find(u => u.id === book.userId);
                if (owner) {
                    result.push({ book, owner });
                }
            }
        });

        return result;
    }, []);

    const filteredUsers = useMemo(() => {
        const users: User[] = JSON.parse(localStorage.getItem('users') || '[]');

        return users.filter(user => {
            const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
            if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (advancedFilters.location && !user.contry?.toLowerCase().includes(advancedFilters.location.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [searchQuery, advancedFilters.location]);

    const filteredBooks = useMemo(() => {
        return availableBooks.filter(({ book, owner }) => {
            if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }
            if (advancedFilters.author && !book.author.toLowerCase().includes(advancedFilters.author.toLowerCase())) {
                return false;
            }
            if (advancedFilters.isbn && !book.isbn?.includes(advancedFilters.isbn)) {
                return false;
            }
            if (advancedFilters.condition && book.condition !== advancedFilters.condition) {
                return false;
            }
            if (advancedFilters.availability && book.availability !== advancedFilters.availability) {
                return false;
            }
            if (advancedFilters.location && !owner.contry?.toLowerCase().includes(advancedFilters.location.toLowerCase())) {
                return false;
            }
            return true;
        });
    }, [availableBooks, searchQuery, advancedFilters]);

    const clearFilters = () => {
        setAdvancedFilters({
            author: '',
            isbn: '',
            condition: '',
            availability: '',
            location: '',
        });
    };

    const handleBookSelect = (bookData: { book: BookTypes; owner: User }) => {
        setSelectedBook(bookData);
        onBookModalOpen();
    };

    const handleUserSelect = (userId: string) => {
        navigate(`/pro-file/${userId}`);
    };

    const hasActiveFilters = Object.values(advancedFilters).some((v) => v !== '');
    const resultCount = searchType === 'books' ? filteredBooks.length : filteredUsers.length;
    const {t} = useTranslation("common");

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
                    <BookResults books={filteredBooks} onBookSelect={handleBookSelect} />
                ) : (
                    <UserResults users={filteredUsers} onUserSelect={handleUserSelect} />
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
                            {selectedBook && (
                                <BookDetail
                                    book={selectedBook.book}
                                    owner={selectedBook.owner} onClose={function (): void {
                                    throw new Error('Function not implemented.');
                                }}                                />
                            )}
                        </Drawer.Body>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Drawer.Root>
        </Box>
    );
}