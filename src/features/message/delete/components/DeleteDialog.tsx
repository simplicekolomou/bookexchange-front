import { Button, CloseButton, Dialog, Portal } from "@chakra-ui/react";

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
            onOpenChange={(open) => { if (!open) onClose(); }}
            role="alertdialog"
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content
                        w={"xl"}
                        h={"s"}
                        bg="gray.700"
                        color="gray.300"
                    >
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <p>{body}</p>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline" onClick={onClose}>{cancelLabel}</Button>
                            </Dialog.ActionTrigger>
                            <Button
                                colorPalette="red"
                                onClick={async () => {
                                    await onConfirm();
                                    onClose();
                                }}
                            >
                                {confirmLabel}
                            </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" onClick={onClose} />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
};
