import { VStack, Box, Text, CardBody, Flex, HStack, Badge, Image } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';
import type { BookApi, BookCondition, BookAvailability } from '../../types/bookApi.ts';
import type { User } from '../../types/user';

interface BookResultsProps {
    books: { book: BookApi; owner: User }[];
    onBookSelect: (bookData: { book: BookApi; owner: User }) => void;
}

const conditionLabels: Record<BookCondition, string> = {
    neuf: 'Neuf',
    excellent: 'Excellent',
    bon: 'Bon',
    acceptable: 'Acceptable',
    use: 'Usé',
};

const availabilityLabels: Record<BookAvailability, string> = {
    echanger: 'À échanger',
    vendre: 'À vendre',
    donner: 'À donner',
    none: 'Non disponible',
};

const availabilityColors: Record<BookAvailability, string> = {
    echanger: 'orange',
    vendre: 'blue',
    donner: 'green',
    none: 'gray',
};

export const BookResults = ({ books, onBookSelect }: BookResultsProps) => {
    if (books.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <BookOpen size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun livre trouvé</Text>
            </Box>
        );
    }

    return (
        <VStack gap={4} align="stretch">
            {books.map(({ book, owner }) => (
                <Box
                    key={book.id}
                    cursor="pointer"
                    _hover={{ shadow: 'lg' }}
                    transition="shadow 0.2s"
                    onClick={() => onBookSelect({ book, owner })}
                >
                    <CardBody p={4}>
                        <Flex gap={4}>
                            {book.userCoverImage || book.coverImage ? (
                                <Image
                                    src={book.userCoverImage || book.coverImage}
                                    alt={book.title}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                />
                            ) : (
                                    <Flex w="full" h="full" align="center" justify="center">
                                        <BookOpen size={32} color="var(--chakra-colors-gray-400)" />
                                    </Flex>
                                )}
                            <Box flex={1} minW={0}>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={1}>
                                    {book.title}
                                </Text>
                                <Text fontSize="sm" color="gray.600" mb={3}>
                                    {book.author}
                                </Text>
                                <HStack gap={2} flexWrap="wrap">
                                    <Badge colorScheme="gray">{conditionLabels[book.condition]}</Badge>
                                    <Badge colorScheme={availabilityColors[book.availability]}>
                                        {availabilityLabels[book.availability]}
                                    </Badge>
                                    {owner.contry && (
                                        <Badge variant="outline">📍 {owner.contry}</Badge>
                                    )}
                                </HStack>
                            </Box>
                        </Flex>
                    </CardBody>
                </Box>
            ))}
        </VStack>
    );
};