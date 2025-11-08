import { useState, useCallback } from 'react';

export interface OpenLibraryBook {
    key: string;
    title: string;
    author_name?: string[];
    isbn?: string[];
    first_publish_year?: number;
    edition_count?: number;
    cover_i?: number;
    language?: string[];
    publisher?: string[];
}

export interface OpenLibraryResult {
    title: string;
    author: string;
    isbn?: string;
    coverImage?: string;
    edition?: string;
    format?: string;
    language?: string;
}

export const useOpenLibrarySearch = () => {
    const [results, setResults] = useState<OpenLibraryResult[]>([]);
    const [loading, setLoading] = useState(false);

    const search = useCallback(async (query: string) => {
        if (!query || query.trim().length < 2) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(
                `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=20&fields=key,title,author_name,isbn,first_publish_year,edition_count,cover_i,language,publisher`
            );
            const data = await response.json();

            const books: OpenLibraryResult[] = (data.docs || []).map((doc: OpenLibraryBook) => {
                const isFrench = doc.language?.includes('fre') || doc.language?.includes('fr');

                return {
                    title: doc.title,
                    author: doc.author_name?.[0] || 'Auteur inconnu',
                    isbn: doc.isbn?.[0],
                    coverImage: doc.cover_i ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg` : undefined,
                    edition: doc.first_publish_year ? `${doc.first_publish_year}` : undefined,
                    format: doc.publisher?.[0],
                    language: isFrench ? 'Français' : 'Autre',
                    isFrench,
                } as OpenLibraryResult & { isFrench: boolean };
            });

            // Sort: French books first
            const sortedBooks = books.sort((a: any, b: any) => {
                if (a.isFrench && !b.isFrench) return -1;
                if (!a.isFrench && b.isFrench) return 1;
                return 0;
            });

            setResults(sortedBooks);
        } catch (error) {
            console.error('Error searching OpenLibrary:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clear = useCallback(() => {
        setResults([]);
    }, []);

    return { results, loading, search, clear };
};
