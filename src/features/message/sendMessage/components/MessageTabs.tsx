import { Button, Flex } from '@chakra-ui/react';
import { GroupIcon, MessageCircle, Users } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { tokens } from "../../../../theme/theme.ts";

interface MessageTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const MessageTabs = ({ value, onChange }: MessageTabsProps) => {
    const { t } = useTranslation("message");

    const tabs = [
        { id: "messages", label: t("messages"), icon: MessageCircle },
        { id: "groups", label: t("newGroup"), icon: GroupIcon },
        { id: "sendMessage", label: t("sendMessage"), icon: Users },
    ];

    return (
        <Flex
            gap={tokens.spacing.md}
            justify="center"
            mb={tokens.spacing.sm}
            mt={tokens.spacing.xs}
            direction={{ base: "column", sm: "row" }}
        >
            {tabs.map((tab) => {
                const isActive = value === tab.id;
                return (
                    <Button
                        key={tab.id}
                        variant={isActive ? "solid" : "outline"}
                        onClick={() => onChange(tab.id)}
                        flex="1"
                        justifyContent="center"
                        gap={tokens.spacing.xs}
                        transition="all 0.2s"
                        _hover={{
                            transform: "translateY(-1px)",
                            boxShadow: "sm",
                        }}
                    >
                        <tab.icon size={16} />
                        <span>{tab.label}</span>
                    </Button>
                );
            })}
        </Flex>
    );
};