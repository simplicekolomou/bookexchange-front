import {
    Stack,
    Heading,
    Text,
    Image,
    Badge,
    Flex,
    IconButton,
    useDisclosure,
    Card, LinkBox, LinkOverlay
} from '@chakra-ui/react';
import {type BookCopy} from '../../types/book.types.ts';
import {useTranslation} from "react-i18next";
import {Edit, Trash} from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

interface BookCardProps {
    book: BookCopy;
    viewMode: 'grid' | 'list'
}

export const BookCard = ({book, viewMode}: BookCardProps) => {
    const {onOpen} = useDisclosure();
    // I18n initialisation
    const {t} = useTranslation(["common", "addBook"]);

    if (viewMode === 'list') {
        return (
            <LinkBox as={Card.Root} w="full" borderWidth="1px" borderRadius="md" p={3}>
                <Flex w="full" align="center" gap={4}>

                    {/*@ts-expect-error Chakra LinkOverlay does not support "to" in TS*/}
                    <LinkOverlay as={RouterLink} to={`/bookCopy/${book.id}`}>
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
                    </LinkOverlay>
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
                    <Flex direction="column" gap={2} mb="auto">
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
            </LinkBox>

        );
    }

    return (
        <LinkBox as={Card.Root} overflow="hidden" borderRadius="lg" shadow="sm" bg="white" h="100%">
            {/*@ts-expect-error Chakra LinkOverlay does not support "to" in TS*/}
            <LinkOverlay as={RouterLink} to={`/bookCopy/${book.id}`}/>
            <Image
                src={book.coverPictureApiUrl}
                alt={book.title}
                objectFit="cover"
                w="full"
                h="180px"
                borderTopRadius="lg"
            />

            {/* Make the body stretch fully */}
            <Card.Body p={4} display="flex" flexDirection="column" flex="1">
                {/* Main content */}
                <Flex direction="column" gap={2} flex="1">
                    <Heading size="sm">{book.title}</Heading>

                    <Stack gap={0}>
                        {book.authors.map((author) => (
                            <Text key={author} fontSize="sm" color="gray.600">
                                {author}
                            </Text>
                        ))}
                    </Stack>

                    {/* Bottom section, pushed down */}
                    <Flex direction="column" mt="auto">
                        <Flex direction="row" gap={2}>
                            <Badge
                                mt={1}
                                w="fit-content"
                                variant="subtle"
                                colorScheme={book.availabilityType === "FOR_SALE" ? "green" : "red"}
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

                        <Flex justify="flex-end" gap={2} pt={2}>
                            <IconButton
                                aria-label="Modifier le livre"
                                size="sm"
                                onClick={onOpen}
                                variant="ghost"
                            >
                                <Edit />
                            </IconButton>
                            <IconButton aria-label="Supprimer le livre" size="sm" colorScheme="red" variant="ghost">
                                <Trash />
                            </IconButton>
                        </Flex>
                    </Flex>
                </Flex>
            </Card.Body>
        </LinkBox>

    );
};