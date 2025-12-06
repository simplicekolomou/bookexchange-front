import {
    VStack,
    Box,
    Text,
    Input,
    Button,
    Drawer,
    Flex,
    Portal,
    Select,
    createListCollection, DrawerContent,
    DrawerHeader, DrawerBody,
} from '@chakra-ui/react';
import { X } from 'lucide-react';

interface AdvancedFiltersProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        author: string;
        isbn: string;
        condition: string
        availability: string;
        location: string;
    };
    onFiltersChange: (filters: AdvancedFiltersProps['filters']) => void;
    onClearFilters: () => void;
    searchType: string;
    hasActiveFilters: boolean;
}

const conditionCollection = createListCollection({
    items: [
        { label: "Tous les états", value: "" },
        { label: "Neuf", value: "neuf" },
        { label: "Excellent", value: "excellent" },
        { label: "Bon", value: "bon" },
        { label: "Acceptable", value: "acceptable" },
        { label: "Usé", value: "usé" },
    ],
});

const availabilityCollection = createListCollection({
    items: [
        { label: "Tous les types", value: "" },
        { label: "À échanger", value: "échanger" },
        { label: "À vendre", value: "vendre" },
        { label: "À donner", value: "donner" },
    ],
});

export const AdvancedFilters = ({
                                    isOpen,
                                    onClose,
                                    filters,
                                    onFiltersChange,
                                    onClearFilters,
                                    searchType,
                                    hasActiveFilters,
                                }: AdvancedFiltersProps) => {
    return (
        <Drawer.Root open={isOpen} onOpenChange={onClose}>
            <Drawer.Backdrop />
            <Drawer.Positioner>
                <DrawerContent>
                    <DrawerHeader borderBottom="1px" borderColor="gray.200">
                        <Flex justify="space-between" align="center">
                            <Box>
                                <Text fontSize="xl" fontWeight="bold">Filtres avancés</Text>
                                <Text fontSize="sm" color="gray.600">
                                    Affinez votre recherche avec des critères supplémentaires
                                </Text>
                            </Box>
                            <Button
                                position="relative"
                                top={0}
                                right={0}
                                onClick={onClose}
                                variant="ghost"
                                size="sm"
                                aria-label="Close"
                            >
                                <X size={16} />
                            </Button>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody py={6}>
                        <VStack gap={4} align="stretch">
                            <Box>
                                <Text fontWeight="medium" mb={2}>Auteur</Text>
                                <Input
                                    placeholder="Nom de l'auteur..."
                                    value={filters.author}
                                    onChange={(e) =>
                                        onFiltersChange({ ...filters, author: e.target.value })
                                    }
                                />
                            </Box>

                            <Box>
                                <Text fontWeight="medium" mb={2}>ISBN</Text>
                                <Input
                                    placeholder="ISBN..."
                                    value={filters.isbn}
                                    onChange={(e) => onFiltersChange({ ...filters, isbn: e.target.value })}
                                />
                            </Box>

                            <Box>
                                <Text fontWeight="medium" mb={2}>État</Text>
                                <Select.Root
                                    collection={conditionCollection}
                                    value={[filters.condition]}
                                    onValueChange={({ value }) =>
                                        onFiltersChange({ ...filters, condition: value[0] })
                                    }
                                    size="md"
                                >
                                    <Select.HiddenSelect />
                                    <Select.Control>
                                        <Select.Trigger>
                                            <Select.ValueText placeholder="Tous les états" />
                                        </Select.Trigger>
                                        <Select.IndicatorGroup>
                                            <Select.Indicator />
                                        </Select.IndicatorGroup>
                                    </Select.Control>
                                    <Portal>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {conditionCollection.items.map((item) => (
                                                    <Select.Item key={item.value} item={item}>
                                                        <Select.ItemText>{item.label}</Select.ItemText>
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Portal>
                                </Select.Root>
                            </Box>

                            {searchType === 'books' && (
                                <Box>
                                    <Text fontWeight="medium" mb={2}>Type de transaction</Text>
                                    <Select.Root
                                        collection={availabilityCollection}
                                        value={[filters.availability]}
                                        onValueChange={({ value }) =>
                                            onFiltersChange({ ...filters, availability: value[0] })
                                        }
                                        size="md"
                                    >
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger>
                                                <Select.ValueText placeholder="Tous les types" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {availabilityCollection.items.map((item) => (
                                                        <Select.Item key={item.value} item={item}>
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                </Box>
                            )}

                            <Box>
                                <Text fontWeight="medium" mb={2}>Localisation</Text>
                                <Input
                                    placeholder="Ville ou région..."
                                    value={filters.location}
                                    onChange={(e) => onFiltersChange({ ...filters, location: e.target.value })}
                                />
                            </Box>

                            {hasActiveFilters && (
                                <Button variant="outline" onClick={onClearFilters} gap={2}>
                                    <X size={16} />
                                    Effacer les filtres
                                </Button>
                            )}
                        </VStack>
                    </DrawerBody>
                </DrawerContent>
            </Drawer.Positioner>
        </Drawer.Root>
    );
};