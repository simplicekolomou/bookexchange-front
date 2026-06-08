import {useSelector} from "react-redux";
import {selectCurrentUser} from "../../../auth/authSlice.ts";
import type {GroupChat} from "../../types/message.types.ts";
import {useGetUserQuery} from "../../../auth/api/authApi.ts";

interface Props {
    chatGroup?: GroupChat | null | undefined;
}
export const useConversationNameController = ({chatGroup}: Props) => {
    const currentUser = useSelector(selectCurrentUser);
    const myId = currentUser?.id;
    // ✅ dérive le nom affiché selon le type de conversation
    // ✅ pour un DIRECT : récupérer l'id de l'autre membre et appeler le hook au niveau supérieur
    const otherMember = chatGroup?.members?.find(
        (member) => member?.endUserId !== myId
    );

    const otherUserId = otherMember?.endUserId; // ex: 2354

// Ensuite, fetch l'autre utilisateur
    const { data: otherUser } = useGetUserQuery(
        { userId: otherUserId },
        { skip: !otherUserId }
    );

    console.log("Nom de l'autre utilisateur :", otherUser?.firstName);

    const conversationName = (() => {
        if (!chatGroup) return "";
        if (chatGroup.groupType === "GROUP") return chatGroup.name ?? "Groupe";
        return otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : chatGroup.name ?? "Chat";
    })();

    // ✅ indique si c'est un groupe ou un direct (utile pour la vue)
    const isDirect = chatGroup?.groupType === "DIRECT";

    return {

        conversationName, // ✅ nom dérivé selon le type
        isDirect,         // ✅ pour adapter l'UI si besoin
        myId,
    }
}