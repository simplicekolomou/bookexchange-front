import {
    Box, Flex, Text, Button, Image,
    VStack, HStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {BookCopy} from "../../../types/book.types.ts";
import {ArrowLeftIcon} from "lucide-react";

interface BookDetailProps {
    book: BookCopy;
}

export const BookDetailContent = ({book} : BookDetailProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation(["addBook", "common"]);
    console.log(book);

    return (
        <Box maxW="900px" mx="auto" mt={8} bg="white" borderRadius="lg" shadow="sm">

            {/* HEADER */}
            <Flex
                align="center"
                borderBottom="1px"
                borderColor="gray.200"
                p={4}
                gap={3}
            >
                <Button variant="ghost" onClick={() => navigate(-1)}>
                    <ArrowLeftIcon />
                </Button>

                <Text fontSize="xl" fontWeight="bold">
                    {book.title}
                </Text>
            </Flex>

            {/* MAIN CONTENT */}
            <Box p={6}>
                <Flex gap={8} direction={{ base: "column", md: "row" }}>

                    {/* COVER IMAGE */}
                    <Image
                        src={book.coverPictureApiUrl}
                        alt={book.title}
                        w="200px"
                        h="300px"
                        objectFit="cover"
                        borderRadius="md"
                        shadow="md"
                        flexShrink={0}
                    />

                    {/* BOOK INFO */}
                    <Box flex="1">
                        <Text fontSize="2xl" fontWeight="bold" mb={1}>
                            {book.title}
                        </Text>

                        <Text fontSize="lg" color="gray.600" mb={4}>
                            {book.authors.join(", ")}
                        </Text>

                        <VStack align="start" gap={3} mb={6}>
                            <HStack>
                                <Text fontWeight="bold" color="accent.700">
                                    {t("addBook:book.bookState")}:
                                </Text>
                                <Text>
                                    {t(`addBook:bookState.options.${book.physicalState}`)}
                                </Text>
                            </HStack>

                            <HStack>
                                <Text fontWeight="bold" color="accent.700">
                                    {t("addBook:availability.optionsLabel")}:
                                </Text>
                                <Text>
                                    {t(`addBook:availability.options.${book.availabilityType}`)}
                                </Text>
                            </HStack>

                            <HStack>
                                <Text fontWeight="bold" color="accent.700">
                                    ISBN:
                                </Text>
                                <Text>{book.isbn}</Text>
                            </HStack>

                            <HStack>
                                <Text fontWeight="bold" color="accent.700">
                                    {t("addBook:book.format")}:
                                </Text>
                                <Text>{book.format}</Text>
                            </HStack>

                            <HStack>
                                <Text fontWeight="bold" color="accent.700">
                                    {t("addBook:book.edition")}:
                                </Text>
                                <Text>{book.edition}</Text>
                            </HStack>
                        </VStack>

                        {/* DESCRIPTION */}
                        <Box mb={6}>
                            <Text fontWeight="bold" color="accent.700" mb={2}>
                                {t("addBook:book.description")}
                            </Text>
                            <Text color="gray.700">
                                {book.description || t("addBook:book.noDescription")}
                            </Text>
                        </Box>

                        {/* OWNER INFO */}
                        <Box p={4} bg="gray.50" borderRadius="md">
                            <Text fontWeight="bold" color="accent.700" mb={2}>
                                {t("addBook:book.owner")}
                            </Text>
                            <Text fontSize="md">
                                {/*{book.ownerId.firstName} {book.owner.lastName}*/}
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};
