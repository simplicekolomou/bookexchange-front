import {Button, Tabs, Text} from '@chakra-ui/react';
import { BookOpen, Users } from 'lucide-react';
import {useTranslation} from "react-i18next";

interface SearchTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchTabs = ({ value, onChange }: SearchTabsProps) => {
    const {t} = useTranslation("search");
    return (
        <Tabs.Root
            value={value}
            onValueChange={({ value }) => onChange(value)}
            mb={6}
        >
            <Tabs.List
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                width="full"
                gap={2}
                borderBottomWidth={0}
            >
                <Tabs.Trigger asChild value="books">
                    <Button
                        variant={value === 'books' ? 'solid' : 'outline'}
                    >
                        <BookOpen size={16} />
                        <Text as="span" fontWeight="bold">{t("tabs.books")}</Text>
                    </Button>
                </Tabs.Trigger>

                <Tabs.Trigger asChild value="users">
                    <Button
                        variant={value === 'users' ? 'solid' : 'outline'}
                    >
                        <Users size={16} />
                        <Text as="span" fontWeight="bold">{t("tabs.users")}</Text>
                    </Button>
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    );
};
