import {
    Box,
    CloseButton,
    Drawer,
    HStack,
    Portal, Spinner,
    VStack,
} from "@chakra-ui/react";
import type {GroupChat} from "../../types/message.types.ts";
import {useSendMessageController} from "../hooks/useSendMessageController.ts";

interface SendMessageBoxProps {
    open?: boolean;
    onClose?: () => void;
    onGroupSelected?: (group: GroupChat) => void;
}

export const SendMessageBox = ({ onClose, open, onGroupSelected }: SendMessageBoxProps) => {

    const controller = useSendMessageController({ onGroupSelected, onClose });
    if (!controller) return null;
    const {
        localUsersForPagination,
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick,
    } = controller;

    if (!localUsersForPagination) return null;

    return (
        <Box bg={"red.500"}>
            <Drawer.Root
                open={open}
                onOpenChange={(isOpen) => { if (!isOpen) if (onClose) {
                    onClose();
                } }}
            >
                {localError && (
                    <Box color="red.500" p={2} textAlign="center">
                        {localError}
                    </Box>
                )}
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner padding={{ base: 0, md: 4 }}>
                        <Drawer.Content
                            bg="gray.700"
                            display="flex"
                            flexDirection="column"
                            color="gray.300"
                            h={{ base: "90%", md: "100%" }}
                        >
                            <Drawer.Header
                                borderBottomWidth="1px"
                                flexWrap="wrap"
                                display="flex"
                            >
                                <Drawer.Title>
                                    {t("sendMessage")}
                                </Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body
                                flex="1"
                                overflowY="auto"
                                onScroll={handleScroll}
                            >
                                <VStack align="stretch">
                                    {localUsersForPagination.map(user => (
                                        <Box
                                            key={user.id}
                                            gap={2}
                                            p={2}
                                            border={"1px solid"}
                                            borderRadius={"md"}
                                            cursor="pointer"
                                            onClick={() => handleUserClick(user)}
                                            bg={"gray.800"}
                                        >
                                            {user.firstName} {user.lastName}
                                        </Box>
                                    ))}

                                    {isFetching && (
                                        <HStack justify="center" py={3}>
                                            <Spinner size="sm" />
                                        </HStack>
                                    )}

                                    {isLastPage && (
                                        <Box textAlign="center" py={3}>Fin de la liste</Box>
                                    )}
                                </VStack>
                            </Drawer.Body>

                            <Drawer.Footer borderTopWidth="1px">
                                <Drawer.CloseTrigger asChild bg={"gray.300"}>
                                    <CloseButton size="sm" onClick={onClose} />
                                </Drawer.CloseTrigger>
                            </Drawer.Footer>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
        </Box>
    );
}
