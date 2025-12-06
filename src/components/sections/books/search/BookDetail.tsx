import {Box, Button, Flex, Text} from '@chakra-ui/react';
import { VStack, HStack, Badge } from '@chakra-ui/react';

export const BookDetail = () => {
    return (
        <Box>
            {/* En-tête avec bouton de fermeture */}
            <Flex
                justify="space-between"
                align="center"
                borderBottom="1px"
                borderColor="gray.200"
                p={4}
            >
                <Text fontSize="xl" fontWeight="bold">Détails du livre</Text>
                <Button variant="outline">
                    Fermer
                </Button>
            </Flex>

            {/* Contenu principal */}
            <Box p={4}>
                <Flex gap={6} direction={{ base: 'column', md: 'row' }}>
                    {/* Image du livre */}
                    <Box
                        w={{ base: 'full', md: '200px' }}
                        h="300px"
                        bg="gray.100"
                        borderRadius="md"
                        overflow="hidden"
                        flexShrink={0}
                    >
                        {/* Remplacez par l'image réelle du livre */}
                    </Box>

                    {/* Informations du livre */}
                    <Box flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                            {/* Titre du livre */}
                        </Text>
                        <Text fontSize="lg" color="gray.600" mb={4}>
                            par {/*auteur du livre */}
                        </Text>

                        {/* Métadonnées */}
                        <VStack align="start" gap={3} mb={6}>
                            <HStack>
                                <Text fontWeight="medium">État:</Text>
                                <Badge colorScheme="blue">{/*état du livre*/}</Badge>
                            </HStack>

                            <HStack>
                                <Text fontWeight="medium">Disponibilité:</Text>
                                <Badge colorScheme="{/*couleur selon disponibilité*/}">
                                    {/*disponibilité du livre*/}
                                </Badge>
                            </HStack>

                            {/* isbn du livre */}

                            {/*format du livre*/}

                            {/*édition du livre*/}
                        </VStack>

                        {/* Description */}
                        {/*description du livre*/}

                        {/* Informations du propriétaire */}
                        <Box p={4} bg="gray.50" borderRadius="md">
                            <Text fontWeight="medium" mb={2}>Propriétaire:</Text>
                            <Flex align="center" gap={3}>
                                <Box>
                                    <Text fontWeight="medium">
                                        {/* nom et prénom du propriétaire */}
                                    </Text>
                                </Box>
                            </Flex>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};