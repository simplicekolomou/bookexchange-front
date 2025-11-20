import { VStack, Box, Text, CardBody, Flex, Avatar } from '@chakra-ui/react';
import { Users } from 'lucide-react';
import type { UserProfile } from '../../types/user.types';
import type {BookCopy} from "../../types/book.types.ts";

interface UserResultsProps {
    user: UserProfile;
    books: BookCopy[];
    onUserSelect: (userId: string) => void;
}

export const UserResults = ({ user, books, onUserSelect }: UserResultsProps) => {
    const userBooks = books.filter(book => book.userId === user.id);
    if (userBooks.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <Users size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun utilisateur trouvé</Text>
            </Box>
        );
    }

    return (
        <VStack gap={4} align="stretch">
            {userBooks.map((book) => (
                <Box
                    key={book.id}
                    cursor="pointer"
                    _hover={{ shadow: 'lg' }}
                    transition="shadow 0.2s"
                    onClick={() => onUserSelect(book.id)}
                >
                    <CardBody p={4}>
                        <Flex align="center" gap={4}>
                            <Avatar.Root size="lg" >
                                <Avatar.Image src={book.coverImage} />
                                <Avatar.Fallback>
                                    {book.coverImage}
                                </Avatar.Fallback>
                            </Avatar.Root>
                            <Box flex={1} minW={0}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={1}>
                                    {book.physicalState} {book.transactionType}
                                </Text>
                            </Box>
                        </Flex>
                    </CardBody>
                </Box>
            ))}
        </VStack>
    );
};