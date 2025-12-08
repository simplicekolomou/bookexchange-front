import {Button, Tabs, Text} from '@chakra-ui/react';
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
                borderBottomWidth={0}
            >
                <Button variant="solid">
                    <Tabs.Trigger
                        value="books"
                    >
                        <BookOpen size={16} />
                        <Text ml={2}>Livres</Text>
                    </Tabs.Trigger>
                </Button>
                <Button variant="solid">
                    <Tabs.Trigger
                        value="users"
                    >
                        <Users size={16} />
                        <Text ml={2}>Utilisateurs</Text>
                    </Tabs.Trigger>
                </Button>
            </Tabs.List>
        </Tabs.Root>
    );
};