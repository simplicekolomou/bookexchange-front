import {Box, Heading, VStack, Spinner, Text, Button} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useGetChatsQuery } from "../../../features/message/messageApi.ts";
import type { GroupChat } from "../../../types/message.types.ts";
import {ChatBox} from "./ChatBox.tsx";
import {MessageCard} from "./MessageCard.tsx";
import {me, mockUsers} from "../../../types/mock.ts";
import {useTranslation} from "react-i18next";
import {subscribeToPush} from "../../../services/notification.ts";
import {MessageTabs} from "./MessageTabs.tsx";

export const Messaging = () => {
    const { data: chats = [], isLoading, isError } = useGetChatsQuery();
    const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
    const [value, setValue] = useState('messages');
    const show = 'Notification' in window
    const [open, setOpen] = useState(true)
    const {t} = useTranslation("notification");

    const location = useLocation();

    // ouvre le chat ciblé par le paramètre `user` quand les chats sont prêts
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const userId = params.get("user");
        if (!userId) return;

        // cherche un chat existant contenant l'utilisateur
        const found = chats.find(c =>
            c.chatType === "ONE_TO_ONE" &&
            c.members.length === 2 &&
            c.members.some(m => m.id === userId) &&
            c.members.some(m => m.id === me.id)
        );
        if (found) {
            setActiveGroup(found);
            return;
        }

        // pas de chat existant -> créer un chat DM temporaire à partir des mocks
        const user = mockUsers[userId];
        if (user) {
            const tempId = `dm-${userId}`;
            const synthetic: GroupChat = {
                id: tempId,
                chatType: "ONE_TO_ONE",
                name: `${user.firstName} ${user.lastName}`,
                members: [me, user],
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
    }, [chats, location.search]);

    if (isLoading) return <Spinner />;
    if (isError) return <Text>Erreur de chargement des discussions</Text>;

    return (
        <Box>
            <Heading size="md" mb={3}>Messages</Heading>
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
            <VStack align="stretch" gap={2}>
                {chats.map((chat) => (
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