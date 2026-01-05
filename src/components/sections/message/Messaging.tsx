import {Box, VStack, Spinner, Text, Button} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { GroupChat } from "../../../types/message.types.ts";
import {ChatBox} from "./ChatBox.tsx";
import {MessageCard} from "./MessageCard.tsx";
import {useTranslation} from "react-i18next";
import {subscribeToPush} from "../../../services/notification.ts";
import {MessageTabs} from "./MessageTabs.tsx";
import {
    useGetGroupChatsQuery,
    useGetMyMessagesQuery
} from "../../../features/message/messageApi.ts";
import {useGetUserQuery} from "../../../features/profile/profileApi.ts";
import {getCurrentUser} from "./hook/utils.ts";

export const Messaging = () => {
    const { data: groupChats = [], isLoading: isGroupLoading, isError: isGroupError } = useGetGroupChatsQuery();
    const { data: chats = [], isLoading: isChatsLoading, isError: isChatsError } = useGetMyMessagesQuery();
    const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
    const [value, setValue] = useState('messages');
    const show = 'Notification' in window
    const [open, setOpen] = useState(true)
    const {t} = useTranslation("notification");
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;
    const { data: targetUser } = useGetUserQuery({ userId: userId ?? "" }, { skip: !userId });



    const me = getCurrentUser();

    // ouvre le chat ciblé par le paramètre `user` quand les groupChats sont prêts
    useEffect(() => {
        if (!userId) return;
        if (!me) return;

        // cherche un chat existant contenant l'utilisateur
        const found = groupChats.find(c =>
            c.members.some(m => m.id === userId) &&
            c.members.some(m => m.id === me.id)
        );
        if (found) {
            setActiveGroup(found);
            return;
        }

        // pas de chat existant -> créer un chat DM temporaire à partir des mocks
        if (targetUser) {
            const tempId = `dm-${userId}`;
            const synthetic: GroupChat = {
                id: tempId,
                name: `${targetUser.firstName} ${targetUser.lastName}`,
                members: [me, targetUser],
                myMembership: {
                    id: `m-temp-${tempId}`,
                    notification: true,
                    user: me,
                    groupChatId: tempId,
                },
                notificationsEnabled: true,
                lastMessage: null,
            };
            setActiveGroup(synthetic);
        }
    }, [groupChats, location.search, userId, targetUser, me]);

    if (isGroupLoading || isChatsLoading) return <Spinner />;

    return (
        <Box>
            <Button
                visibility={show && open ? 'visible' : 'hidden'}
                onClick={() => {
                    setOpen(!open)
                    subscribeToPush().then(res => console.log(res))
                }}>
                {t("notification:question")}
            </Button>
            <MessageTabs
                value={value}
                onChange={(val) => setValue(val)}
            />
            {(isGroupError && isChatsError) && (
                <Text>Erreur de chargement des discussions</Text>
            )}
            <VStack align="stretch" gap={2}>
                {groupChats.map((group) => (
                    <MessageCard
                        key={group.id}
                        group={group}
                        isActive={!!activeGroup && activeGroup.id === group.id}
                        onSelected={(g) => setActiveGroup(g)}
                    />
                ))}

                {chats.map((chat) =>(
                    <MessageCard
                        key={chat.id}
                        group={chat}
                        isActive={!!activeGroup && activeGroup.id === chat.id}
                        onSelected={(g) => setActiveGroup(g)}
                    />
                ))}
            </VStack>

            <ChatBox
                chatGroup={activeGroup}
                onClose={() => setActiveGroup(null)}
                open={!!activeGroup}
            />
        </Box>
    );
}