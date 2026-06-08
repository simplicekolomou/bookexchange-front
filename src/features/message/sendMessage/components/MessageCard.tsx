import type { GroupChat } from "../../types/message.types.ts";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";
import { tokens } from "../../../../theme/theme.ts";
import { Trash2 } from "lucide-react";
import { DeleteDialog } from "../../delete/components/DeleteDialog.tsx";
import { useMessageCardController } from "../hooks/useMessageCardController.ts";
import {useDeleteMessageController} from "../../delete/hooks/useDeleteMessageController.ts";
import {useSendMessageController} from "../hooks/useSendMessageController.ts";

type MessageCardProps = {
    group: GroupChat;
    isActive?: boolean;
    onSelected: (group: GroupChat | null) => void;
};

export const MessageCard = ({ group, onSelected, isActive = false }: MessageCardProps) => {
    const {
        handleActivate,
        handleKeyDown,
        t,
    } = useMessageCardController({ group, onSelected });
    const {conversationName}= useSendMessageController({chatGroup: group});
    const {
        isDialogOpen,
        setDialogOpen,
        handleConfirmDelete,
        localError,
    } = useDeleteMessageController({group});

    const lastMessageDate = group?.lastMessage?.sendTime ? new Date(group.lastMessage.sendTime).toLocaleString() : undefined;

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
                onClick={handleActivate}
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
            >
                {localError && (
                    <Box color="red.500" mb={tokens.spacing.xs} fontSize="sm">
                        {localError}
                    </Box>
                )}
                <Flex direction="column" gap={tokens.spacing.xs}>
                    <Flex justifyContent="space-between" alignItems="center">
                        <Text fontWeight="bold" fontSize="md" color="fg.default">
                            {group.name ?? conversationName}
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
                            color="fg.muted"
                            transition="color 0.2s"
                            _hover={{ color: "red.500" }}
                        />
                    </Flex>
                    {group.lastMessage && (
                        <>
                            <Text fontSize="sm" color="fg.default">
                                {group.lastMessage.content}
                            </Text>
                            <Text fontSize="xs" color="fg.muted" fontStyle="italic">
                                {lastMessageDate}
                            </Text>
                        </>
                    )}
                </Flex>
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
                body={`${t("delete.confirm")} "${group.name}" ?`}
                confirmLabel={t("actions.delete")}
                cancelLabel={t("actions.cancel")}
            />
        </>
    );
};