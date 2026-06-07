import { Box, Combobox, HStack, Image, Portal, Text, Spinner, Heading } from "@chakra-ui/react";
import type { BookCopy } from "../../types/book.types.ts";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import { FilterBox } from "./FilterBox.tsx";
import {useSuggestionController} from "../hooks/useSuggestionController.ts";
import {tokens} from "../../../../theme/theme.ts";

interface Props {
    initialQuery?: string;
    onSelectItem: (item: BookCopy | UserProfile) => void;
    searchType: "books" | "users";
}

export const SuggestionBox = ({ initialQuery = "", onSelectItem, searchType }: Props) => {
    const {
        t, inputValue, setInputValue, filters, setFilters, debounced,
        booksCollection, usersCollection, isBookFetching, isUserFetching,
        errorMessage, handleScroll, selectItem,
    } = useSuggestionController({ initialQuery, onSelectItem, searchType });

    if (searchType === "books") {
        return (
            <Box>
                <Heading>{t("titleBookSearch")}</Heading>
                <FilterBox
                    values={filters}
                    onChange={(values) => setFilters((prev) => ({ ...prev, ...(values as Partial<typeof filters>) }))}
                />
                <Combobox.Root
                    collection={booksCollection}
                    openOnClick={true}
                    inputValue={inputValue}
                    onInputValueChange={(e) => { if (e.reason === "input-change") setInputValue(e.inputValue); }}
                    positioning={{ sameWidth: false, placement: "bottom-end" }}
                >
                    <Combobox.Control>
                        <Combobox.Input
                            placeholder={t("searchBookPlaceholder")}
                            borderColor="gray.300"
                        />
                        <Combobox.IndicatorGroup bg={tokens.colors.primary}>
                            <Combobox.ClearTrigger />
                            <Combobox.Trigger />
                        </Combobox.IndicatorGroup >
                    </Combobox.Control>
                    <Portal>
                        <Combobox.Positioner>
                            <Combobox.Content
                                minW="lg" bg="white" color="gray.800"
                                border="1px solid" borderColor="gray.200"
                                boxShadow="md" zIndex={10}
                                onScroll={(e) => handleScroll(e, isBookFetching)}
                            >
                                {isBookFetching ? (
                                    <HStack p="2"><Spinner size="xs" borderWidth="1px" /><Text>Recherche…</Text></HStack>
                                ) : errorMessage ? (
                                    <Text p="2" color="fg.error">{errorMessage}</Text>
                                ) : booksCollection.items?.length ? (
                                    booksCollection.items.map((book: BookCopy) => (
                                        <Combobox.Item key={book.id} item={book}
                                                       onPointerDown={(e) => e.preventDefault()}
                                                       onClick={() => selectItem(book)}
                                        >
                                            <HStack justify="flex-start" align="center" gap="3" py="2">
                                                {book.id ? (
                                                    <Image src={book.coverPictureApiUrl} alt={book.title} boxSize="130px" objectFit="contain" borderRadius="md" />
                                                ) : (
                                                    <span style={{ width: 130, height: 40, background: "var(--chakra-colors-gray-100)", borderRadius: 8, display: "inline-block" }} />
                                                )}
                                                <Box style={{ minWidth: 0 }} display="flex" flexDirection="column">
                                                    <Text fontWeight="medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.title}</Text>
                                                    <Text color="fg.muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{book.authors?.join(", ")}</Text>
                                                </Box>
                                            </HStack>
                                            <Combobox.ItemIndicator />
                                        </Combobox.Item>
                                    ))
                                ) : debounced ? (
                                    <Text p="2" color="fg.muted">{t("noResults")}</Text>
                                ) : (
                                    <Text p="2" color="fg.muted">{t("tapToSearch")}</Text>
                                )}
                            </Combobox.Content>
                        </Combobox.Positioner>
                    </Portal>
                </Combobox.Root>
                <Box><Text mt={1} fontSize="xs" color="gray.500">{t("bookAstuces")}</Text></Box>
            </Box>
        );
    }

    return (
        <Box>
            <Heading>{t("titleUserSearch")}</Heading>
            <Combobox.Root
                collection={usersCollection}
                openOnClick={true}
                inputValue={inputValue}
                onInputValueChange={(e) => { if (e.reason === "input-change") setInputValue(e.inputValue); }}
                positioning={{ sameWidth: false, placement: "bottom-end" }}
            >
                <Combobox.Control>
                    <Combobox.Input
                        placeholder={t("searchUserPlaceholder")}
                        borderColor={"gray.300"}
                    />
                    <Combobox.IndicatorGroup>
                        <Combobox.ClearTrigger />
                        <Combobox.Trigger />
                    </Combobox.IndicatorGroup>
                </Combobox.Control>
                <Portal>
                    <Combobox.Positioner>
                        <Combobox.Content
                            minW="lg" bg="white" color="gray.800"
                            border="1px solid" borderColor="gray.200"
                            boxShadow="md" zIndex={10}
                            onScroll={(e) => handleScroll(e, isUserFetching)}
                        >
                            {isUserFetching ? (
                                <HStack p="2"><Spinner size="xs" borderWidth="1px" /><Text>Recherche…</Text></HStack>
                            ) : errorMessage ? (
                                <Text p="2" color="fg.error">{errorMessage}</Text>
                            ) : usersCollection.items?.length ? (
                                usersCollection.items.map((user: UserProfile) => (
                                    <Combobox.Item bg="white" _hover={{ bg: "gray.100" }} _focus={{ bg: "gray.100" }}
                                                   key={user.id} item={user}
                                                   onPointerDown={(e) => e.preventDefault()}
                                                   onClick={() => selectItem(user)}
                                    >
                                        <HStack justify="flex-start" align="center" gap="3" py="2">
                                            {user.id ? (
                                                <Image src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} boxSize="130px" objectFit="contain" borderRadius="md" />
                                            ) : (
                                                <span style={{ width: 130, height: 40, background: "var(--chakra-colors-gray-100)", borderRadius: 8, display: "inline-block" }} />
                                            )}
                                            <Box style={{ minWidth: 0 }} display="flex" flexDirection="column">
                                                <Text fontWeight="medium" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.firstName} {user.lastName}</Text>
                                                <Text color="fg.muted" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.bio}</Text>
                                            </Box>
                                        </HStack>
                                        <Combobox.ItemIndicator />
                                    </Combobox.Item>
                                ))
                            ) : debounced ? (
                                <Text p="2" color="fg.muted">{t("noResults")}</Text>
                            ) : (
                                <Text p="2" color="fg.muted">{t("tapToSearch")}</Text>
                            )}
                        </Combobox.Content>
                    </Combobox.Positioner>
                </Portal>
            </Combobox.Root>
            <Box><Text mt={1} fontSize="xs" color="gray.500">{t("userAstuces")}</Text></Box>
        </Box>
    );
};