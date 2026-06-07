import {useTranslation} from "react-i18next";
import type { GroupChat } from "../../types/message.types.ts";

interface Props {
    group: GroupChat;
    onSelected: (group: GroupChat | null) => void; // accepte null pour désélection
}
export const useMessageCardController = ({group, onSelected}: Props) => {
    const {t} = useTranslation("message");

    const handleActivate = () => onSelected(group);
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