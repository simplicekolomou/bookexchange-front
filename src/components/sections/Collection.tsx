import { useState } from 'react';
import { CollectionContent } from './CollectionContent.tsx';
import {useGetUserBooksQuery} from "../../features/book/bookApi.ts";

export const Collection = () => {
    const { data: userBooks = [], isLoading, isError } = useGetUserBooksQuery();

    const [searchQuery, setSearchQuery] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [filter, setFilter] = useState<'all' | 'available'>('all');

    const filteredBooks = userBooks.filter((book) => {
        const matchesSearch =
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.authors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesFilter =
            filter === 'all' || book.availabilityType !== 'NONE';

        return matchesSearch && matchesFilter;
    });

    if (isLoading) return <p>Loading…</p>;
    if (isError) return <p>Failed to load books</p>;

    return (
        <CollectionContent
            books={filteredBooks}
            searchQuery={searchQuery}
            viewMode={viewMode}
            filter={filter}
            onSearchChange={setSearchQuery}
            onViewModeChange={setViewMode}
            onFilterChange={setFilter}
        />
    );
};
