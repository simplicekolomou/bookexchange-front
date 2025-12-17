import {Box, SimpleGrid, Text, useBreakpointValue, } from '@chakra-ui/react';
import { Users } from 'lucide-react';
import type {BookCopyAndOwner} from "../../../../types/book.types.ts";
import {UserCard} from "../../../layout/UserCard.tsx";

interface UserResultsProps {
    books: BookCopyAndOwner[];
    //onUserSelect: (userId: string) => void;
}

export const UserResults = ({books}: UserResultsProps) => {
    const gridColumns = useBreakpointValue({
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
    });
    if (books.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <Users size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun utilisateur trouvé</Text>
            </Box>
        );
    }

    return (
            <SimpleGrid
                columns={gridColumns}
                gap={4}
                w="full"
            >
                {books.map((book) => (
                    <UserCard
                        key={book.bookCopy.id}
                        bookAndOwner={book}
                        viewMode={"grid"}
                    />
                ))}
            </SimpleGrid>
    )
};