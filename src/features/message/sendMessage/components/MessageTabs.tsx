import { Button, Tabs, Text } from '@chakra-ui/react';
import { GroupIcon, MessageCircle, Users } from 'lucide-react';
import { useTranslation } from "react-i18next";

interface SearchTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const MessageTabs = ({ value, onChange }: SearchTabsProps) => {
    const { t } = useTranslation("message");
    return (
        <Tabs.Root
            value={value}
            onValueChange={(details) => {
                const newValue: string = typeof details === 'string' ? details : details?.value ?? '';
                onChange(newValue);
            }}
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

                <Tabs.Trigger asChild value="groups">
                    <Button
                        width="full"
                        justifyContent="center"
                        variant={value === 'groups' ? 'solid' : 'outline'}
                    >
                        <GroupIcon size={16} />
                        <Text as="span" fontWeight="bold">{t("newGroup")}</Text>
                    </Button>
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="sendMessage">
                    <Button
                        width="full"
                        justifyContent="center"
                        variant={value === 'sendMessage' ? 'solid' : 'outline'}
                    >
                        <Users size={16} />
                        <Text as="span" fontWeight="bold">{t("sendMessage")}</Text>
                    </Button>
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    );
};
