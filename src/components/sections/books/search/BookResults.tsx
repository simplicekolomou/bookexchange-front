import { VStack, Box, Text } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';
// import type { BookCopy } from '../../../../types/book.types.ts';
// import type {User} from "../../../../types/auth.types.ts";

// interface BookResultsProps {
//     books: { book: BookCopy; owner: User }[];
//     onBookSelect: (bookData: { book: BookCopy; owner: User }) => void;
// }

export const BookResults = () => {
    //if (books.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <BookOpen size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun livre trouvé</Text>
            </Box>
        );
    //}

    return (
        <VStack gap={4} align="stretch">

        </VStack>
    );
};