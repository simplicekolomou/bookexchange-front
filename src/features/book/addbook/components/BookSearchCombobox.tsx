"use client";

import {
    Combobox,
    HStack,
    Portal,
    Span,
    Spinner,
    Image,
    Box,
} from "@chakra-ui/react";
import type {VolumeShort} from "../../types/book.types.ts";
import { useAddbookController } from "../hooks/useAddbookController.ts";
import {tokens} from "../../../../theme/theme.ts";

type Props = {
    onSelect: (item: VolumeShort) => void;
};

export function BookSearchCombobox({ onSelect }: Props) {
    const controller = useAddbookController();

    return (
        <Combobox.Root
            collection={controller.collection}
            placeholder="Rechercher un livre"
            openOnClick={true}
            inputValue={controller.inputValue}
            onInputValueChange={(e) => {
                if (e.reason === "input-change") {
                    controller.setInputValue(e.inputValue);
                }
            }}
            positioning={{ sameWidth: false, placement: "bottom-end" }}
        >
            <Combobox.Label>Rechercher un livre</Combobox.Label>
            <Combobox.Control>
                <Combobox.Input
                    placeholder="Livre à chercher"
                    borderColor="gray.200"
                />
                <Combobox.IndicatorGroup
                    background ={tokens.colors.primary}
                    borderRadius = "5px"
                >
                    <Combobox.ClearTrigger />
                    <Combobox.Trigger
                        color="white"
                    />
                </Combobox.IndicatorGroup>
            </Combobox.Control>

            <Portal>
                <Combobox.Positioner>
                    <Combobox.Content
                        minW="lg"
                        bg="white"
                        color="gray.800"
                        border="1px solid"
                        borderColor="gray.200"
                        boxShadow="md"
                        zIndex={10}                  
                    >
                        {controller.isFetching ? (
                            <HStack p="2">
                                <Spinner size="xs" borderWidth="1px" />
                                <Span>Recherche…</Span>
                            </HStack>
                        ) : controller.errorMessage ? (
                            <Span p="2" color="fg.error">
                                {controller.errorMessage}
                            </Span>
                        ) : controller.collection.items?.length ? (
                            controller.collection.items.map((book: VolumeShort) => (
                                <Combobox.Item
                                    bg="white"
                                    _hover={{ bg: "gray.100" }}
                                    _focus={{ bg: "gray.100" }}
                                    key={book.id}
                                    item={book}
                                    onPointerDown={(e) => {
                                        // prévenir le blur de l'input qui fermerait le combobox avant le click
                                        e.preventDefault();
                                    }}
                                    onClick={() => onSelect(book)}
                                >
                                    <HStack justify="flex-start" align="center" gap="3" py="2">
                                        {book.coverUrl ? (
                                            <Image
                                                src={book.coverUrl + "?fife=w130-h130"}
                                                alt={book.title}
                                                boxSize="130px"
                                                objectFit="contain"
                                                borderRadius="md"
                                            />
                                        ) : (
                                            <span
                                                style={{
                                                    width: 130,
                                                    height: 40,
                                                    background: "var(--chakra-colors-gray-100)",
                                                    borderRadius: 8,
                                                    display: "inline-block",
                                                }}
                                            />
                                        )}
                                        <Box style={{ minWidth: 0 }} display="flex" flexDirection="column">
                                            <Span fontWeight="medium" truncate>
                                                {book.title}
                                            </Span>
                                            <Span color="fg.muted" truncate>
                                                {book.authors?.join(", ")}
                                            </Span>
                                        </Box>
                                    </HStack>
                                    <Combobox.ItemIndicator />
                                </Combobox.Item>
                            ))
                        ) : controller.debouncedController.debounced ? (
                            <Span p="2" color="fg.muted">
                                Aucun résultat
                            </Span>
                        ) : (
                            <Span p="2" color="fg.muted">
                                Commencez à taper pour chercher
                            </Span>
                        )}
                    </Combobox.Content>
                </Combobox.Positioner>
            </Portal>
        </Combobox.Root>
    );
}
