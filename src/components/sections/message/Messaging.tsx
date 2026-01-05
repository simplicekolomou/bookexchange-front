import {Box, VStack, Spinner, Text, Button} from "@chakra-ui/react";
import { useState } from "react";
import type { GroupChat } from "../../../types/message.types.ts";
import {ChatBox} from "./ChatBox.tsx";
import {MessageCard} from "./MessageCard.tsx";
import {useTranslation} from "react-i18next";
import {subscribeToPush} from "../../../services/notification.ts";
import {MessageTabs} from "./MessageTabs.tsx";
import {
    useGetGroupChatsQuery,
} from "../../../features/message/messageApi.ts";
import {GroupBox} from "./GroupBox.tsx";
import {SendMessageBox} from "./SendMessageBox.tsx";

export const Messaging = () => {
    const { data: groupChats = [], isLoading: isGroupLoading, isError: isGroupError } = useGetGroupChatsQuery();
    const [activeGroup, setActiveGroup] = useState<GroupChat | null>(null);
    const [value, setValue] = useState('messages');
    const show = 'Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied';
    const [open, setOpen] = useState(true)
    const {t} = useTranslation("notification");

    if (isGroupLoading) return <Spinner />;

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
            {(isGroupError) && (
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
            </VStack>

            <ChatBox
                chatGroup={activeGroup}
                onClose={() => setActiveGroup(null)}
                open={!!activeGroup}
            />
            <SendMessageBox
                open={value === 'sendMessage'}
                onGroupSelected={(group: GroupChat) => setActiveGroup(group)}
                onClose={() => setValue('')}
            />

            <GroupBox
                open={value === 'groups'}
                onClose={() => setValue('')}
            />
        </Box>
    );
}