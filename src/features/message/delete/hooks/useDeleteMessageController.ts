import {useDeleteGroupMutation} from "../../api/messageApi.ts";
import {useState} from "react";
import type {GroupChat} from "../../types/message.types.ts";
import {useTranslation} from "react-i18next";

export const useDeleteMessageController = ({group}: {group: GroupChat}) => {
    const [deleteGroup] = useDeleteGroupMutation();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const {t} = useTranslation("message");
    const [localError, setLocalError] = useState<string | null>(null);

    const handleConfirmDelete = async () => {
        try {
            await deleteGroup(group.id).unwrap();
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