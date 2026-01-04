import type { GroupChat } from "../../../types/message.types.ts";
import { Box, Flex, Text } from "@chakra-ui/react";
import { tokens } from "../../ui/theme.ts";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { useDeleteGroupMutation } from "../../../features/message/messageApi.ts";
import { DeleteDialog } from "./DeleteDialog";

type MessageCardProps = {
    group: GroupChat;
    isActive?: boolean;
    onSelected: (group: GroupChat | null) => void; // accepte null pour désélection
};

export const MessageCard = ({ group, onSelected, isActive = false }: MessageCardProps) => {
    const [deleteGroup] = useDeleteGroupMutation();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleActivate = () => onSelected(group);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteGroup(group.id).unwrap();
        } catch (err) {
            console.log(err);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Box
                borderWidth="1px"
                borderColor={isActive ? "blue.400" : tokens.colors.border}
                borderRadius="md"
                mb={1}
                bg={tokens.colors.surface}
                p={2}
                cursor="pointer"
                role="button"
                aria-pressed={!!isActive}
                tabIndex={0}
                onClick={handleActivate}
                onKeyDown={handleKeyDown}
                _hover={{ boxShadow: "sm" }}
                boxShadow={isActive ? "outline" : undefined}
                position="relative"
                flexDirection="column"
            >
                <Flex flexDirection="column">
                    <Flex justifyContent="space-between" alignItems="center">
                        <Box fontWeight="bold">
                            <Text>{group.name}</Text>
                        </Box>
                        <Trash2
                            size={16}
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation(); // empêche la sélection du groupe
                                setDialogOpen(true);
                            }}
                            style={{ cursor: "pointer" }}
                            aria-label="Delete group"
                        />
                    </Flex>
                    <Box>
                        <Text fontStyle={"italic"} fontSize={"xs"}>
                            {group.lastMessage ? (group.lastMessage.sendTime instanceof Date ? group.lastMessage.sendTime.toLocaleString() : new Date(group.lastMessage.sendTime).toLocaleString()) : ""}
                        </Text>
                    </Box>
                </Flex>
                <Box mt={2}>{group.lastMessage?.content ?? ""}</Box>
            </Box>
            <DeleteDialog
                isOpen={isDialogOpen}
                onClose={() => {
                    setDialogOpen(false);
                    onSelected(null); // revenir sur Messaging quand on ferme/annule
                }}
                onConfirm={async () => {
                    await handleConfirmDelete();
                    onSelected(null); // désélectionner et revenir sur Messaging après suppression
                }}
                title="Supprimer le groupe"
                body={`Voulez-vous vraiment supprimer "${group.name}" ?`}
                confirmLabel={isDeleting ? "Suppression..." : "Supprimer"}
                cancelLabel="Annuler"
            />
        </>
    );
};
