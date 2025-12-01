import { Tabs, Text } from '@chakra-ui/react';
import { BookOpen, Users } from 'lucide-react';

interface SearchTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchTabs = ({ value, onChange }: SearchTabsProps) => {
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
            >
                <Tabs.Trigger
                    value="books"
                    justifyContent="center"
                >
                    <BookOpen size={16} />
                    <Text ml={2}>Livres</Text>
                </Tabs.Trigger>
                <Tabs.Trigger
                    value="users"
                    justifyContent="center"
                >
                    <Users size={16} />
                    <Text ml={2}>Utilisateurs</Text>
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    );
};