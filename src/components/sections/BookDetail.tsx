import {Box, Button, Flex, Image, Text} from '@chakra-ui/react';
import type { BookApi } from '../../types/bookApi.ts';
import type { User } from '../../types/user';

interface BookDetailModalProps {
    book: BookApi;
    owner: User;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    onClose: () => void;
}

export const BookDetail = ({ book, owner, onClose }: BookDetailModalProps) => {
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
                <Button variant="outline" onClick={onClose}>
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
                        {book.userCoverImage || book.coverImage ? (
                            <Image
                                as="img"
                                src={book.userCoverImage || book.coverImage}
                                alt={book.title}
                                w="full"
                                h="full"
                                objectFit="cover"
                            />
                        ) : (
                            <Flex w="full" h="full" align="center" justify="center">
                                <BookOpen size={48} color="var(--chakra-colors-gray-400)" />
                            </Flex>
                        )}
                    </Box>

                    {/* Informations du livre */}
                    <Box flex={1}>
                        <Text fontSize="2xl" fontWeight="bold" color="gray.800" mb={2}>
                            {book.title}
                        </Text>
                        <Text fontSize="lg" color="gray.600" mb={4}>
                            par {book.author}
                        </Text>

                        {/* Métadonnées */}
                        <VStack align="start" gap={3} mb={6}>
                            <HStack>
                                <Text fontWeight="medium">État:</Text>
                                <Badge colorScheme="blue">{conditionLabels[book.condition as keyof typeof conditionLabels]}</Badge>
                            </HStack>

                            <HStack>
                                <Text fontWeight="medium">Disponibilité:</Text>
                                <Badge colorScheme={availabilityColors[book.availability]}>
                                    {availabilityLabels[book.availability]}
                                </Badge>
                            </HStack>

                            {book.isbn && (
                                <HStack>
                                    <Text fontWeight="medium">ISBN:</Text>
                                    <Text color="gray.600">{book.isbn}</Text>
                                </HStack>
                            )}

                            {book.format && (
                                <HStack>
                                    <Text fontWeight="medium">Format:</Text>
                                    <Text color="gray.600">{book.format}</Text>
                                </HStack>
                            )}

                            {book.edition && (
                                <HStack>
                                    <Text fontWeight="medium">Édition:</Text>
                                    <Text color="gray.600">{book.edition}</Text>
                                </HStack>
                            )}
                        </VStack>

                        {/* Description */}
                        {book.description && (
                            <Box mb={6}>
                                <Text fontWeight="medium" mb={2}>Description:</Text>
                                <Text color="gray.600" lineHeight="tall">
                                    {book.description}
                                </Text>
                            </Box>
                        )}

                        {/* Informations du propriétaire */}
                        <Box p={4} bg="gray.50" borderRadius="md">
                            <Text fontWeight="medium" mb={2}>Propriétaire:</Text>
                            <Flex align="center" gap={3}>
                                <Avatar.Root size="md">
                                    <Avatar.Image src={owner.avatar} />
                                    <Avatar.Fallback>
                                        {owner.firstName[0]}{owner.lastName[0]}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                                <Box>
                                    <Text fontWeight="medium">
                                        {owner.firstName} {owner.lastName}
                                    </Text>
                                    {owner.contry && (
                                        <Text fontSize="sm" color="gray.600">
                                            📍 {owner.contry}
                                        </Text>
                                    )}
                                </Box>
                            </Flex>
                        </Box>
                    </Box>
                </Flex>
            </Box>
        </Box>
    );
};

// N'oubliez pas d'importer les composants manquants et de définir les constantes
import { VStack, HStack, Badge, Avatar } from '@chakra-ui/react';
import { BookOpen } from 'lucide-react';

const conditionLabels = {
    neuf: 'Neuf',
    excellent: 'Excellent',
    bon: 'Bon',
    acceptable: 'Acceptable',
    usé: 'Usé',
};

const availabilityLabels = {
    echanger: 'À échanger',
    vendre: 'À vendre',
    donner: 'À donner',
    none: 'Non disponible',
};

const availabilityColors = {
    echanger: 'orange',
    vendre: 'blue',
    donner: 'green',
    none: 'gray',
};