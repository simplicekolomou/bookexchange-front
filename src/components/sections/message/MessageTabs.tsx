import {Button, Tabs, Text} from '@chakra-ui/react';
import {MessageCircle, Users} from 'lucide-react';
import {useTranslation} from "react-i18next";
import {GroupBox} from "./GroupBox.tsx";

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
                gridTemplateColumns="repeat(2, 1fr)"
                width="full"
                gap={2}
                borderBottomWidth={0}
            >
                <Tabs.Trigger asChild value="messages">
                    <Button
                        variant={value === 'messages' ? 'solid' : 'outline'}
                    >
                        <MessageCircle size={16} />
                        <Text as="span" fontWeight="bold">{t("messages")}</Text>
                    </Button>
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="group">
                    <Button
                        variant={value === 'group' ? 'solid' : 'outline'}
                    >
                        <Users size={16} />
                        <Text as="span" fontWeight="bold">{t("newGroup")}</Text>
                    </Button>
                </Tabs.Trigger>
            </Tabs.List>
            <GroupBox
                open={value === 'group'}
                onClose={() => onChange('messages')}
            />
        </Tabs.Root>
    );
};
