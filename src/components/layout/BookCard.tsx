import {
    Stack,
    Heading,
    Text,
    Image,
    Badge,
    Flex,
    IconButton,
    useDisclosure, For,
    Card
} from '@chakra-ui/react';
import {type BookCopy} from '../../types/book.types.ts';
import {useTranslation} from "react-i18next";
import {Edit, Trash} from "lucide-react";

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
            <Card.Root w="full" borderWidth="1px" borderRadius="md" p={3}>
                <Flex w="full" align="center" gap={4}>

                    {/* Book Cover */}
                    <Image
                        objectFit="cover"
                        w="90px"
                        h="120px"
                        src={book.coverPictureApiUrl}
                        alt={book.title}
                        borderRadius="md"
                        flexShrink={0}
                    />

                    {/* Text Section */}
                    <Flex direction="column" flex="1" minW={0}>
                        <Heading size="sm" mb={1}>
                            {book.title}
                        </Heading>

                        {/* Authors */}
                        <Flex direction="column" gap={0} mb={1}>
                            {book.authors.map((author) => (
                                <Text key={author} fontSize="sm" color="gray.600">
                                    {author}
                                </Text>
                            ))}
                        </Flex>
                        {/*<hr color="gray.200" />*/}
                        <Flex direction="row" gap={2}>
                            <Badge
                                mt={1}
                                w="fit-content"
                                variant="subtle"
                                colorScheme={book.availabilityType === 'FOR_SALE' ? 'green' : 'red'}
                                fontSize="80%"
                                fontStyle="italic"
                                border="1px Solid"
                                borderColor="accent.600"
                                color="accent.600"
                            >
                                {t(`addBook:availability.options.${book.availabilityType}`)}
                            </Badge>
                            <Badge
                                mt={1}
                                w="fit-content"
                                variant="subtle"
                                fontSize="80%"
                                fontStyle="italic"
                                border="1px Solid"
                                borderColor="accent.600"
                                color="accent.600"
                            >
                                {t(`addBook:bookState.options.${book.physicalState}`)}
                            </Badge>
                        </Flex>
                    </Flex>

                    {/* Actions */}
                    <Flex direction="column" gap={2} ml={2}>
                        <IconButton
                            aria-label="Modifier le livre"
                            size="sm"
                            onClick={onOpen}
                            variant="ghost"
                        ><Edit/></IconButton>
                        <IconButton
                            aria-label="Supprimer le livre"
                            size="sm"
                            colorScheme="red"
                            variant="ghost"
                        ><Trash/></IconButton>
                    </Flex>

                </Flex>
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