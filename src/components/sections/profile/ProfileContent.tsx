import { Box, Text, VStack, CardBody, HStack, Badge } from '@chakra-ui/react';
import { BookOpen, Heart, Star } from 'lucide-react';
import type {BookApi, WishlistItem} from '../../../types/bookApi.ts';
import { BookCard } from '../../layout/BookCard';

interface ProfileContentProps {
    activeTab: string;
    books: BookApi[];
    wishlist: WishlistItem[];
}

export const ProfileContent = ({
                                   activeTab,
                                   books,
                                   wishlist,
                               }: ProfileContentProps) => {
    const renderEmptyState = (icon: React.ReactNode, message: string) => (
        <Box textAlign="center" py={12}>
            {icon}
            <Text color="gray.500" mt={4}>{message}</Text>
        </Box>
    );

    if (activeTab === 'collection') {
        if (books.length === 0) {
            return renderEmptyState(
                <BookOpen size={48} color="var(--chakra-colors-gray-400)" />,
                "Aucun livre dans la collection"
            );
        }

        return (
            <Box
                display="grid"
                gridTemplateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)"
                }}
                gap={6}
            >
                {books.map((book) => (
                    <BookCard
                        key={book.id}
                        book={book}
                        viewMode="grid"
                    />
                ))}
            </Box>
        );
    }

    if (activeTab === 'wishlist') {
        if (wishlist.length === 0) {
            return renderEmptyState(
                <Heart size={48} color="var(--chakra-colors-gray-400)" />,
                "Aucun livre dans la liste de souhaits"
            );
        }

        return (
            <VStack gap={4} align="stretch">
                {wishlist.map((item) => (
                    <Box key={item.id}>
                        <CardBody>
                            <Text fontWeight="bold" fontSize="lg">{item.title}</Text>
                            <Text color="gray.600">{item.author}</Text>
                        </CardBody>
                    </Box>
                ))}
            </VStack>
        );
    }

    if (activeTab === 'exchanges') {
        /*if (exchanges.length === 0) {
            return renderEmptyState(
                <Repeat size={48} color="var(--chakra-colors-gray-400)" />,
                "Aucun échange récent"
            );
        }*/

        return (
            <VStack gap={4} align="stretch">
                {/*exchanges.map((exchange) => (*/
                    <Box key={""/*exchange.id*/}>
                        <CardBody>
                            <HStack justify="space-between" align="start">
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg">{/*exchange.bookTitle*/}</Text>
                                    <Text color="gray.600">{/*exchange.bookAuthor*/}</Text>
                                    <Badge colorScheme="blue" mt={2}>
                                        {/*exchange.type*/}
                                    </Badge>
                                </Box>
                                <Text fontSize="sm" color="gray.500">
                                    {/*new Date(exchange.date).toLocaleDateString('fr-FR')*/}
                                </Text>
                            </HStack>
                        </CardBody>
                    </Box>
                /*))*/}
            </VStack>
        );
    }

    if (activeTab === 'ratings') {
        /*if (ratings.length === 0) {
            return renderEmptyState(
                <Award size={48} color="var(--chakra-colors-gray-400)" />,
                "Aucune note reçue"
            );
        }*/

        return (
            <VStack gap={4} align="stretch">
                {/*ratings.map((rating) => (*/
                    <Box key={""/*rating.id*/}>
                        <CardBody>
                            <HStack justify="space-between" align="start" mb={2}>
                                <HStack gap={2}>
                                    <Text fontWeight="medium">{/*rating.fromUserName*/}</Text>
                                    <HStack gap={1}>
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={""/*i < rating.stars ? "yellow" : "gray"*/}
                                                color={""/*i < rating.stars ? "yellow" : "gray"*/}
                                            />
                                        ))}
                                    </HStack>
                                </HStack>
                                <Text fontSize="sm" color="gray.500">
                                    {/*new Date(rating.date).toLocaleDateString('fr-FR')*/}
                                </Text>
                            </HStack>
                            {/*rating.comment && (
                                <Text color="gray.600">{rating.comment}</Text>
                            )*/}
                        </CardBody>
                    </Box>
                /*))*/}
            </VStack>
        );
    }

    return null;
};