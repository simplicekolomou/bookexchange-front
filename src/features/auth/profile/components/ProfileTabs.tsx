import { Tabs, Text } from '@chakra-ui/react';
import { BookOpen, Heart, Repeat, Award } from 'lucide-react';
import {tokens} from "../../../../theme/theme.ts";

interface ProfileTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const ProfileTabs = ({ value, onChange }: ProfileTabsProps) => {
    return (
        <Tabs.Root
            value={value}
            onValueChange={({ value }) => onChange(value)}
        >
            <Tabs.List
                display="flex"
                justifyContent="center"
                gap={tokens.spacing.sm}
                mb={tokens.spacing.lg}
                borderBottomWidth={0}
            >
                {[
                    { id: 'collection', label: 'Collection', icon: BookOpen },
                    { id: 'wishlist', label: 'Souhaits', icon: Heart },
                    { id: 'exchange', label: 'Échanges', icon: Repeat },
                    { id: 'rating', label: 'Notes', icon: Award },
                ].map((tab) => (
                    <Tabs.Trigger
                        key={tab.id}
                        value={tab.id}
                        display="flex"
                        alignItems="center"
                        gap={2}
                        px={{ base: 3, sm: 4 }}
                        py={1.5}
                        borderWidth="1px"
                        borderColor="colorPalette.default"
                        borderRadius={tokens.radius.md}
                        color="colorPalette.default"
                        bg="transparent"
                        transition="all 0.2s"
                        _selected={{
                            bg: 'colorPalette.default',
                            color: 'white',
                            borderColor: 'colorPalette.default',
                        }}
                        _hover={{
                            transform: 'translateY(-1px)',
                            boxShadow: 'sm',
                        }}
                    >
                        <tab.icon size={16} color="currentColor" />
                        <Text
                            display={{ base: 'none', sm: 'inline' }}
                            color="inherit"
                            fontWeight="medium"
                        >
                            {tab.label}
                        </Text>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
        </Tabs.Root>
    );
};