import {
    Stack,
    Heading,
    Text,
    Image,
    Badge,
    Flex,
    IconButton,
    useDisclosure, Box, For,
    Card
} from '@chakra-ui/react';
import {type BookCopy} from '../../types/book.types.ts';
import {useTranslation} from "react-i18next";

interface BookCardProps {
    book: BookCopy;
    viewMode: 'grid' | 'list'
}

export const BookCard = ({ book, viewMode }: BookCardProps) => {
    const { onOpen } = useDisclosure();
    // I18n initialisation
    const {t} = useTranslation(["common", "addBook"]);

    if (viewMode === 'list') {
        return (
            <Card.Root>
                <Card.Body direction="row" overflow="hidden" w="full">
                    <Image
                        objectFit="cover"
                        maxW={{ base: '100px', sm: '150px' }}
                        src={book.coverPictureApiUrl}
                        alt={book.title}
                    />
                    <Stack flex={1}>
                        <Card.Body>
                            <Flex justify="space-between" align="start">
                                <Box flex={1}>
                                    <Heading size="md">{book.title}</Heading>
                                    <For each={book.authors}>
                                        {item => (
                                            <Text py="2" color="gray.600">
                                                {item}
                                            </Text>
                                        )}
                                    </For>
                                    <Badge colorScheme={book.availabilityType === 'FOR_SALE' ? 'green' : 'red'}>
                                        {t(`addBook:availability.options.${book.availabilityType}`)}
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
                        </Card.Body>
                    </Stack>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <Card.Root>
                <Card.Body>
                    <Image
                        src={book.coverPictureApiUrl}
                        alt={book.title}
                        borderRadius="lg"
                        height="200px"
                        objectFit="cover"
                        width="full"
                    />
                    <Stack mt={4} gap={3}>
                        <Heading size="md">{book.title}</Heading>
                        <Flex direction="row" justify="space-between" align="start">
                            <For each={book.authors}>
                                {item => (
                                    <Text color="gray.600">{item}</Text>
                                )}
                            </For>
                        </Flex>
                        <Badge
                            colorScheme={book.availabilityType === 'FOR_SALE' ? 'green' : 'red'}
                            alignSelf="flex-start"
                        >
                            {book.availabilityType === 'FOR_SALE' ? 'Disponible' : 'Indisponible'}
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
                </Card.Body>
        </Card.Root>
    );
};