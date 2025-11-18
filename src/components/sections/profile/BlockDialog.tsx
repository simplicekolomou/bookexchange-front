import {
    Dialog,
    DialogBackdrop,
    DialogTitle,
    DialogBody,
    Button,
    Text,
    VStack, DialogActionTrigger, DialogPositioner,
} from '@chakra-ui/react';

interface BlockDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isBlocked: boolean;
}

export const BlockDialog = ({
                                isOpen,
                                onClose,
                                onConfirm,
                                isBlocked,
                            }: BlockDialogProps) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog.Root open={isOpen}>
            <DialogBackdrop />
            <DialogPositioner>
                <DialogTitle>
                    {isBlocked ? "Débloquer cet utilisateur ?" : "Bloquer cet utilisateur ?"}
                </DialogTitle>
                <DialogBody>
                    <VStack gap={2} align="start">
                        <Text>
                            {isBlocked
                                ? "Vous pourrez à nouveau voir ce profil et recevoir des messages de cet utilisateur."
                                : "Vous ne pourrez plus voir ce profil ni recevoir de messages de cet utilisateur."}
                        </Text>
                    </VStack>
                </DialogBody>
                <DialogActionTrigger>
                    <Button variant="outline" onClick={onClose}>
                        Annuler
                    </Button>
                    <Button onClick={handleConfirm}>
                        Confirmer
                    </Button>
                </DialogActionTrigger>
            </DialogPositioner>
        </Dialog.Root>
    );
};