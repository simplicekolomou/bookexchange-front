import { Button, CloseButton, Dialog, Portal, Text } from "@chakra-ui/react";
import { tokens } from "../../../../theme/theme.ts";

type DeleteDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void> | void;
    title?: string;
    body?: string;
    confirmLabel?: string;
    cancelLabel?: string;
};

export const DeleteDialog = ({
                                 isOpen,
                                 onClose,
                                 onConfirm,
                                 title,
                                 body,
                                 confirmLabel,
                                 cancelLabel,
                             }: DeleteDialogProps) => {
    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(open) => {
                if (!open) onClose();
            }}
            role="alertdialog"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        bg="bg.surface"
                        color="fg.default"
                        borderRadius={tokens.radius.xl}
                        boxShadow="xl"
                        p={0}
                        overflow="hidden"
                    >
                        <Dialog.Header
                            borderBottomWidth="1px"
                            borderColor="border.default"
                            py={tokens.spacing.md}
                            px={tokens.spacing.lg}
                        >
                            <Dialog.Title fontSize="lg" fontWeight="semibold">
                                {title}
                            </Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body
                            py={tokens.spacing.md}
                            px={tokens.spacing.lg}
                        >
                            <Text>{body}</Text>
                        </Dialog.Body>

                        <Dialog.Footer
                            borderTopWidth="1px"
                            borderColor="border.default"
                            py={tokens.spacing.md}
                            px={tokens.spacing.lg}
                            gap={tokens.spacing.sm}
                        >
                            <Dialog.ActionTrigger asChild>
                                <Button
                                    variant="outline"
                                    onClick={onClose}
                                    transition="all 0.2s"
                                    _hover={{
                                        bg: "bg.subtle",
                                        transform: "translateY(-1px)",
                                    }}
                                >
                                    {cancelLabel}
                                </Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="red"
                                variant="solid"
                                onClick={async () => {
                                    await onConfirm();
                                    onClose();
                                }}
                                transition="all 0.2s"
                                _hover={{
                                    transform: "translateY(-1px)",
                                    boxShadow: "sm",
                                }}
                            >
                                {confirmLabel}
                            </Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton
                                size="sm"
                                onClick={onClose}
                                position="absolute"
                                top={tokens.spacing.md}
                                right={tokens.spacing.md}
                                _hover={{ bg: "bg.subtle" }}
                                transition="background 0.2s"
                            />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};