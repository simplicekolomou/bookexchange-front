import {Button, Tabs, Text} from '@chakra-ui/react';
import {GroupIcon, MessageCircle, Users} from 'lucide-react';
import {useTranslation} from "react-i18next";
import {GroupBox} from "./GroupBox.tsx";
import {SendMessageBox} from "./SendMessageBox.tsx";

interface SearchTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const MessageTabs = ({ value, onChange }: SearchTabsProps) => {
    const {t} = useTranslation("message");
    return (
        <Tabs.Root
            value={value}
            onValueChange={({ value }) => onChange(value)}
            mb={3}
            mt={2}
        >
            <Tabs.List
                display="grid"
                gridTemplateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
                width="full"
                gap={1}
                alignItems="center"
                borderBottomWidth={0}
            >
                <Tabs.Trigger asChild value="messages">
                    <Button
                        width="full"
                        justifyContent="center"
                        variant={value === 'messages' ? 'solid' : 'outline'}
                    >
                        <MessageCircle size={16} />
                        <Text as="span" fontWeight="bold">{t("messages")}</Text>
                    </Button>
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="group">
                    <Button
                        width="full"
                        justifyContent="center"
                        variant={value === 'group' ? 'solid' : 'outline'}
                    >
                        <GroupIcon size={16} />
                        <Text as="span" fontWeight="bold">{t("newGroup")}</Text>
                    </Button>
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="users">
                    <Button
                        width="full"
                        justifyContent="center"
                        variant={value === 'users' ? 'solid' : 'outline'}
                        onClick={() => onChange('users')}
                    >
                        <Users size={16} />
                        <Text as="span" fontWeight="bold">{t("sendMessage")}</Text>
                    </Button>
                </Tabs.Trigger>
            </Tabs.List>
            <GroupBox
                open={value === 'group'}
                onClose={() => onChange('messages')}
            />
            <SendMessageBox
                open={value === 'users'}
                onClose={() => onChange('messages')}
            />
        </Tabs.Root>
    );
};
