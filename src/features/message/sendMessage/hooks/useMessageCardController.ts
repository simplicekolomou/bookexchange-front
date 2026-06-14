import {useTranslation} from "react-i18next";
import type { Chat } from "../../types/message.types.ts";

interface Props {
    chat: Chat;
    onSelected: (chat: Chat | null) => void; // accepte null pour désélection
}
export const useMessageCardController = ({chat, onSelected}: Props) => {
    const {t} = useTranslation("message");

    const handleActivate = () => onSelected(chat);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
        }
    };

    return {
        handleActivate,
        handleKeyDown,
        t
    }
}