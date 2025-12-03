import { Tabs, Text } from '@chakra-ui/react';
import { BookOpen, Heart, Repeat, Award } from 'lucide-react';

interface ProfileTabsProps {
    value: string;
    onChange: (value: string) => void;
}

export const ProfileTabs = ({ value, onChange }: ProfileTabsProps) => {
    return (
        <Tabs.Root value={value} onValueChange={({ value }) => onChange(value)}>
            <Tabs.List
                display="flex"
                justifyContent="center"
                gap={4}
                mb={6}
                borderBottomWidth={0}
            >
                <Tabs.Trigger
                    value="collection"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    px={{ base: 3, sm: 4 }}
                    py={1}
                    borderWidth="1px"
                    borderColor="colorPalette.default"
                    borderRadius="md"
                    color="colorPalette.default"
                    bg="transparent"
                    _selected={{
                        bg: 'colorPalette.default',
                        color: 'white',
                        borderColor: 'colorPalette.default',
                    }}
                >
                    <BookOpen size={16} color="currentColor" />
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">Collection</Text>
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">({/*counts.collection*/})</Text>
                </Tabs.Trigger>

                <Tabs.Trigger
                    value="wishlist"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    px={{ base: 3, sm: 4 }}
                    py={1}
                    borderWidth="1px"
                    borderColor="colorPalette.default"
                    borderRadius="md"
                    color="colorPalette.default"
                    bg="transparent"
                    _selected={{
                        bg: 'colorPalette.default',
                        color: 'white',
                        borderColor: 'colorPalette.default',
                    }}
                >
                    <Heart size={16} color="currentColor" />
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">Souhaits</Text>
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">({/*counts.wishlist*/})</Text>
                </Tabs.Trigger>

                <Tabs.Trigger
                    value="exchange"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    px={{ base: 3, sm: 4 }}
                    py={1}
                    aria-label="Échanges"
                    borderWidth="1px"
                    borderColor="colorPalette.default"
                    borderRadius="md"
                    color="colorPalette.default"
                    bg="transparent"
                    _selected={{
                        bg: 'colorPalette.default',
                        color: 'white',
                        borderColor: 'colorPalette.default',
                    }}
                >
                    <Repeat size={16} color="currentColor" />
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">Échanges</Text>
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">({/*counts.exchanges*/})</Text>
                </Tabs.Trigger>

                <Tabs.Trigger
                    value="rating"
                    display="flex"
                    alignItems="center"
                    gap={2}
                    px={{ base: 3, sm: 4 }}
                    py={1}
                    borderWidth="1px"
                    borderColor="colorPalette.default"
                    borderRadius="md"
                    color="colorPalette.default"
                    _selected={{
                        bg: 'colorPalette.default',
                        color: 'white',
                        borderColor: 'colorPalette.default',
                    }}
                >
                    <Award size={16} color="currentColor" />
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">Notes</Text>
                    <Text display={{ base: 'none', sm: 'inline' }} color="inherit">({/*counts.ratings*/})</Text>
                </Tabs.Trigger>
            </Tabs.List>
        </Tabs.Root>
    );
};
