import { Tabs, Text, HStack } from '@chakra-ui/react';
import { BookOpen, Heart, Repeat, Award } from 'lucide-react';

interface ProfileTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const ProfileTabs = ({ value, onChange }: ProfileTabsProps) => {
    return (
        <Tabs.Root value={value} onValueChange={({ value }) => onChange(value)}>
            <Tabs.List
                display="grid"
                gridTemplateColumns="repeat(4, 1fr)"
                gap={2}
                mb={6}
            >
                <Tabs.Trigger value="collection" justifyContent="center">
                    <HStack gap={2}>
                        <BookOpen size={16} />
                        <Text>Collection</Text>
                        <Text color="gray.500">({/*counts.collection*/})</Text>
                    </HStack>
                </Tabs.Trigger>

                <Tabs.Trigger value="wishlist" justifyContent="center">
                    <HStack gap={2}>
                        <Heart size={16} />
                        <Text>Souhaits</Text>
                        <Text color="gray.500">({/*counts.wishlist*/})</Text>
                    </HStack>
                </Tabs.Trigger>

                <Tabs.Trigger value="exchange" justifyContent="center">
                    <HStack gap={2}>
                        <Repeat size={16} />
                        <Text>Échanges</Text>
                        <Text color="gray.500">({/*counts.exchanges*/})</Text>
                    </HStack>
                </Tabs.Trigger>

                <Tabs.Trigger value="rating" justifyContent="center">
                    <HStack gap={2}>
                        <Award size={16} />
                        <Text>Notes</Text>
                        <Text color="gray.500">({/*counts.ratings*/})</Text>
                    </HStack>
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    );
};