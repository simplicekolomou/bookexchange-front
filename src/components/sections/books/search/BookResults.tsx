import {Box, Text, SimpleGrid, useBreakpointValue} from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';
import type {BookCopy} from '../../../../types/book.types.ts';
import {BookCard} from "../../../layout/BookCard.tsx";

interface BookResultsProps {
    books: BookCopy[]
    //onSelect: (bookData: { book: BookCopy}) => void;
    //highlightIndex: number;
}

export const BookResults = ({ books }: BookResultsProps) => {
    const gridColumns = useBreakpointValue({
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
    });
    if (books.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <BookOpen size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun livre trouvé</Text>
            </Box>
        );
    }

    return (
        <SimpleGrid columns={gridColumns} gap={4} w="full">
            {books.map((book) => (
                <BookCard
                    key={book.id}
                    book={book}
                    viewMode="grid"
                />
            ))}
        </SimpleGrid>
    );
};