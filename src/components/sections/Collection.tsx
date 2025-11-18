import { useState } from 'react';
import type { BookApi} from '../../types/bookApi.ts';
import { CollectionContent } from './CollectionContent.tsx';

export const Collection = () => {
    const [books] = useState<BookApi[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState<'all' | 'available'>('all');

    const filteredBooks = books.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filter === 'all' || book.availability !== 'Indisponible';
        return matchesSearch && matchesFilter;
    });

    return (
        <>
            <CollectionContent
                books={filteredBooks}
                searchQuery={searchQuery}
                viewMode={viewMode}
                filter={filter}
                onSearchChange={setSearchQuery}
                onViewModeChange={setViewMode}
                onFilterChange={setFilter}
            />
        </>
    );
};