import {
    CardBody,
    Stack,
    Heading,
    Text,
    Image,
    Badge,
    Flex,
    IconButton,
    useDisclosure, Box
} from '@chakra-ui/react';
import type { BookTypes } from '../../types/book.types.ts';

interface BookCardProps {
    book: BookTypes;
    viewMode: 'grid' | 'list'
}

export const BookCard = ({ book, viewMode }: BookCardProps) => {
    const { onOpen } = useDisclosure();

    if (viewMode === 'list') {
        return (
            <>
                <CardBody direction="row" overflow="hidden" w="full">
                    <Image
                        objectFit="cover"
                        maxW={{ base: '100px', sm: '150px' }}
                        src={book.coverImage}
                        alt={book.title}
                    />
                    <Stack flex={1}>
                        <CardBody>
                            <Flex justify="space-between" align="start">
                                <Box flex={1}>
                                    <Heading size="md">{book.title}</Heading>
                                    <Text py="2" color="gray.600">
                                        {book.author}
                                    </Text>
                                    <Badge colorScheme={book.availability === 'vendre' ? 'green' : 'red'}>
                                        {book.availability === 'vendre' ? 'Vendre' : 'Indisponible'}
                                    </Badge>
                                </Box>
                                <Flex gap={2} ml={4}>
                                    <IconButton
                                        aria-label="Modifier le livre"
                                        size="sm"
                                        onClick={onOpen}
                                    />
                                    <IconButton
                                        aria-label="Supprimer le livre"
                                        size="sm"
                                        colorScheme="red"
                                    />
                                </Flex>
                            </Flex>
                        </CardBody>
                    </Stack>
                </CardBody>
            </>
        );
    }

    return (
        <>

                <CardBody>
                    <Image
                        src={book.coverImage}
                        alt={book.title}
                        borderRadius="lg"
                        height="200px"
                        objectFit="cover"
                        width="full"
                    />
                    <Stack mt={4} gap={3}>
                        <Heading size="md">{book.title}</Heading>
                        <Text color="gray.600">{book.author}</Text>
                        <Badge
                            colorScheme={book.availability === 'vendre' ? 'green' : 'red'}
                            alignSelf="flex-start"
                        >
                            {book.availability === 'vendre' ? 'Disponible' : 'Indisponible'}
                        </Badge>
                        <Flex gap={2} justify="flex-end">
                            <IconButton
                                aria-label="Modifier le livre"
                                size="sm"
                                onClick={onOpen}
                            />
                            <IconButton
                                aria-label="Supprimer le livre"
                                size="sm"
                                colorScheme="red"
                            />
                        </Flex>
                    </Stack>
                </CardBody>
        </>
    );
};