import type { Chat } from "../../types/message.types.ts";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { tokens } from "../../../../theme/theme.ts";
import { Trash2 } from "lucide-react";
import { DeleteDialog } from "../../delete/components/DeleteDialog.tsx";
import { useMessageCardController } from "../hooks/useMessageCardController.ts";
import { useDeleteMessageController } from "../../delete/hooks/useDeleteMessageController.ts";
import { useSendMessageController } from "../hooks/useSendMessageController.ts";
import {useGetUnreadCountForChatQuery, useMarkAllMessageOfChatAsReadMutation} from "../../api/messageApi.ts";
import React from "react";

type MessageCardProps = {
    chat: Chat;
    isActive?: boolean;
    onSelected: (chat: Chat | null) => void;
};

export const MessageCard = ({ chat, onSelected, isActive = false }: MessageCardProps) => {
    const {
        handleActivate,
        handleKeyDown,
        t,
    } = useMessageCardController({ chat: chat, onSelected });
    const { conversationName } = useSendMessageController({ chat: chat });
    const {
        isDialogOpen,
        setDialogOpen,
        handleConfirmDelete,
        localError,
    } = useDeleteMessageController({ chat: chat });
    const { data: unreadMessages } = useGetUnreadCountForChatQuery({ chatId: chat.id });
    const [markReadFor] = useMarkAllMessageOfChatAsReadMutation();

    const unreadCount = unreadMessages ?? 0;

    const lastMessageDate = chat?.lastMessage?.sendTime
        ? new Date(chat.lastMessage.sendTime).toLocaleString()
        : undefined;

    return (
        <>
            <Box
                borderWidth="1px"
                borderColor={isActive ? "colorPalette.default" : "border.default"}
                borderRadius={tokens.radius.md}
                mb={tokens.spacing.xs}
                bg={isActive ? "bg.subtle" : "bg.surface"}
                p={tokens.spacing.sm}
                cursor="pointer"
                role="button"
                aria-pressed={isActive}
                tabIndex={0}
                onClick={
                    () => {
                        markReadFor({ chatId: chat.id });
                        handleActivate();
                    }
                }
                onKeyDown={handleKeyDown}
                transition="all 0.2s"
                _hover={{
                    boxShadow: "md",
                    transform: "translateY(-1px)",
                    borderColor: "colorPalette.default",
                }}
                _focus={{
                    outline: "none",
                    boxShadow: "outline",
                }}
                position="relative"
                minH="70px"
            >
                {localError && (
                    <Box color="red.500" mb={tokens.spacing.xs} fontSize="sm">
                        {localError}
                    </Box>
                )}
                <Flex direction="column" gap={tokens.spacing.xs}>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold" fontSize="md" color="fg.default">
                            {chat.name ?? conversationName}
                        </Text>
                        <Icon
                            as={Trash2}
                            boxSize={4}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setDialogOpen(true);
                            }}
                            cursor="pointer"
                            aria-label="Delete group"
                            transition="color 0.2s"
                            _hover={{ color: "red.500" }}
                            color={"gray.500"}
                        />
                    </Flex>
                    {chat.lastMessage && (
                        <>
                            <Text fontSize="sm" color="fg.default">
                                {chat.lastMessage.content}
                            </Text>
                            <Text fontSize="xs" color="fg.muted" fontStyle="italic">
                                {lastMessageDate}
                            </Text>
                        </>
                    )}
                </Flex>
                <Box position="absolute" right={3} top="70%">
                    {unreadCount > 0 && (
                        <Box
                            bg="red.500"
                            color="white"
                            borderRadius="full"
                            px={2}
                            py={0.5}
                            fontSize="xs"
                            fontWeight="bold"
                            minW="20px"
                            textAlign="center"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Box>
                    )}
                </Box>
            </Box>

            <DeleteDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    onSelected(null);
                }}
                onConfirm={async () => {
                    await handleConfirmDelete();
                    onSelected(null);
                }}
                title={t("delete.title")}
                body={`${t("delete.confirm")} "${chat.name}" ?`}
                confirmLabel={t("actions.delete")}
                cancelLabel={t("actions.cancel")}
            />
        </>
    );
};