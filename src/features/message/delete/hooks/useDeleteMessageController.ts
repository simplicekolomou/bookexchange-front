import {useState} from "react";
import type {Chat} from "../../types/message.types.ts";
import {useTranslation} from "react-i18next";
import {useDeleteChatMutation} from "../../api/messageApi.ts";

export const useDeleteMessageController = ({chat}: {chat: Chat}) => {
    const [deleteGroup] = useDeleteChatMutation();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {t} = useTranslation("message");
    const [localError, setLocalError] = useState<string | null>(null);

    const handleConfirmDelete = async () => {
        try {
            await deleteGroup(chat.id).unwrap();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 500) {
                setLocalError(t("unAuthenticated"));
            } else {
                setLocalError(t("serverError"));
            }
        }
    };

    return {
        isDialogOpen,
        setDialogOpen,
        handleConfirmDelete,
        localError,
        setLocalError
    };
}