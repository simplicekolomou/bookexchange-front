import { useState } from 'react';
import type { Book } from '../../types/book';
import { CollectionContent } from './CollectionContent.tsx';
import { AddBookDialog } from './AddBookDialog.tsx';
import { Box } from '@chakra-ui/react';
import {AuthenticatedNavbar} from "../layout/AuthenticatedNavbar.tsx";
import {useTranslation} from "react-i18next";

export const Collection = () => {
    const [books] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [filter, setFilter] = useState<'all' | 'available'>('all');


    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || book.availability !== 'none';
        return matchesSearch && matchesFilter;
    });
    const {t} = useTranslation("collections");

    return (
        <Box minH="100vh" bg="gray.50">
            <AuthenticatedNavbar
                title={t("title")}
                bookCount={filteredBooks.length}
                onAddBook={() => setIsAddDialogOpen(true)}
            />

            <CollectionContent
                books={books}
                searchQuery={searchQuery}
                viewMode={viewMode}
                filter={filter}
                onSearchChange={setSearchQuery}
                onViewModeChange={setViewMode}
                onFilterChange={setFilter}
            />

            <AddBookDialog
                open={isAddDialogOpen}
            />
        </Box>
    );
};