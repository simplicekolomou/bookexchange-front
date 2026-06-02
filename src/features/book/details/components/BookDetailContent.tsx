import {
    Box, Flex, Text, Button, Image,
    VStack, HStack,
    Show, Badge
} from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {BookCopy} from "../../types/book.types.ts";
import {ArrowLeftIcon, PencilIcon, SendHorizonalIcon} from "lucide-react";
import type {UserProfile} from "../../../profile/types/profile.types.ts";

interface BookDetailProps {
    book: BookCopy;
    owner: UserProfile | undefined;
    isUserOwner: boolean;
}


export const BookDetailContent = ({book, owner, isUserOwner} : BookDetailProps) => {
    const navigate = useNavigate();
    const { t } = useTranslation(["addBook", "common"]);

    return (
        <Box maxW="800px" mx="auto" mt={5} mb={5}>
            <Button
                variant="solid"
                onClick={() => navigate(-1)}
            >
                <ArrowLeftIcon /> {t("common:actions.back")}
            </Button>
            <Box mt={5} bg="white" borderRadius="lg" shadow="sm">

                {/* HEADER */}
                <Flex
                    align="center"
                    borderBottom="1px"
                    borderColor="gray.200"
                    p={2}
                    gap={3}
                >
                    <Show when={isUserOwner}>
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/edit-book/${book.id}`)}
                            ml="auto"
                        >
                            <PencilIcon/>
                            {t("common:actions.edit")}
                        </Button>
                    </Show>
                </Flex>

                {/* MAIN CONTENT */}
                <Box p={2}>
                    <Flex gap={4} direction={{ base: "column", md: "row" }}>

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
                            <Text fontSize="lg" fontWeight="bold" mb={1}>
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
                            <Box p={4} bg="gray.50" borderRadius="md" display={"flex"} gap={2}>
                                <Flex direction="column" gap={2}>
                                    <Text fontWeight="bold" color="accent.700" mb={2}>
                                        {t("addBook:book.owner")} :
                                    </Text>
                                    <Show when={owner}>
                                        <Text fontSize="md">
                                            {owner?.firstName} {owner?.lastName}
                                        </Text>
                                    </Show>
                                    <Show when={!owner}>
                                        <Text color="gray.700">
                                            {t("addBook:book.noOwner")}
                                        </Text>
                                    </Show>

                                    <Box display="flex" alignItems="flex-end" gap={2} justifyContent="flex-end">
                                        {/* TODO mettre à jour le lien pour le message */}
                                        <Show when={book.availabilityType === "FOR_TRADE" && owner}>
                                            <Link to={"#"}>
                                                <Badge
                                                    mt={1}
                                                    h={8}
                                                    w="fit-content"
                                                    variant="subtle"
                                                    fontSize="80%"
                                                    fontStyle="italic"
                                                    border="1px Solid"
                                                    borderColor="accent.600"
                                                    color="accent.600"
                                                    fontWeight="bold"
                                                    colorScheme={book.availabilityType === 'FOR_TRADE' ? 'green' : 'red'}
                                                >
                                                    <Text>{t("addBook:book.exchangeButton")}</Text>
                                                    <SendHorizonalIcon />
                                                </Badge>
                                            </Link>

                                            <Link to={`/user/${owner?.id}/profile`} >
                                                <Badge
                                                    mt={1}
                                                    h={8}
                                                    w="fit-content"
                                                    variant="subtle"
                                                    fontSize="80%"
                                                    fontWeight="bold"
                                                    fontStyle="italic"
                                                    border="1px Solid"
                                                    borderColor="accent.600"
                                                >
                                                    {t("addBook:book.ownerProfileLink")}
                                                </Badge>
                                            </Link>
                                            <Link to={"#"} >
                                                <Badge
                                                    mt={1}
                                                    h={8}
                                                    w="fit-content"
                                                    variant="subtle"
                                                    fontSize="80%"
                                                    fontWeight="bold"
                                                    fontStyle="italic"
                                                    border="1px Solid"
                                                    borderColor="accent.600"
                                                >
                                                    {t("common:actions.ownerMessage")}
                                                </Badge>
                                            </Link>
                                        </Show>
                                    </Box>
                                </Flex>
                            </Box>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Box>
    );
};
