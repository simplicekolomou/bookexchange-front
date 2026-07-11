import { useEffect, useState } from "react";
import {
    useAddChatMutation,
    useLazyFindChatByMembersQuery,
} from "../../api/messageApi";
import type { AddChatRequest, Chat } from "../../types/message.types";
import {
    useGetMeQuery,
    useGetUserQuery,
} from "../../../auth/api/authApi";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import type { UserProfile } from "../../../auth/profile/types/profile.types";
import {useSearchPaginatedUsersController} from "./useSearchPaginatedUsersController.ts";

interface Props {
    onChatSelected?: (chat: Chat) => void;
    onClose?: () => void;
}

export const useCreateDirectChatController = ({ onChatSelected, onClose }: Props) => {
    const { t } = useTranslation("message");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;

    const { users, isFetching, isLastPage, handleScroll, searchTerm, setSearchTerm, isSearching } =
        useSearchPaginatedUsersController({ size: 15 });
    
    const [localError, setLocalError] = useState<string | null>(null);
    const { data: currentUser } = useGetMeQuery();
    const { data: targetUser } = useGetUserQuery(
        { userId: userId ?? "" },
        { skip: !userId }
    );
    const [addChat] = useAddChatMutation();
    const [triggerFindChat] = useLazyFindChatByMembersQuery();

    /**
     * Cherche un chat direct existant, sinon le crée.
     * On ne se base plus sur un code HTTP (404) pour détecter l'absence de chat :
     * l'API renvoie maintenant `null` dans le body si rien n'existe, avec un 200 OK.
     * Cela évite un log d'erreur réseau dans la console du navigateur pour un cas
     * qui n'est pas vraiment une erreur, juste une absence de résultat.
     */
    const handleAddDirectChat = async (user: UserProfile) => {
        setLocalError(null);
        try {
            const existingChat = await triggerFindChat({
                chatType: "DIRECT",
                targetUserId: user.id,
            }).unwrap();

            if (existingChat) {
                onChatSelected?.(existingChat);
                onClose?.();
                return;
            }

            // existingChat est null : aucun chat trouvé, on en crée un
            const newChat: AddChatRequest = {
                chatType: "DIRECT",
                name: null,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) },
                ],
            };
            const chat = await addChat(newChat).unwrap();
            onChatSelected?.(chat);
            onClose?.();

        } catch (error) {
            const status = (error as { status?: number })?.status;
            setLocalError(status === 401 ? t("unAuthenticated") : t("serverError"));
        }
    };

    // Ouverture auto si ?user dans l'URL
    useEffect(() => {
        if (!userId || !targetUser) return;
        (async () => {
            await handleAddDirectChat(targetUser);
        })();
    }, [userId, targetUser]);

    return {
        users,
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick: handleAddDirectChat,
        searchTerm,
        setSearchTerm,
        isSearching,
    };
};