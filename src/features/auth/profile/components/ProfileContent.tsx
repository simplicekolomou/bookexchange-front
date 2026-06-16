import {Box, Text, VStack, HStack, Badge, Icon, Card, Grid, Button} from '@chakra-ui/react';
import { Award, BookOpen, Heart, Repeat, Star } from 'lucide-react';
import type { BookCopy, WishlistItem } from '../../../book/types/book.types.ts';
import { BookCard } from '../../../../components/ui/BookCard.tsx';
import React from 'react';
import {tokens} from "../../../../theme/theme.ts";
import { Link } from "react-router-dom";

type ExchangeItem = {
    id?: string | number;
    bookTitle: string;
    bookAuthor?: string;
    type: string;
    date: string | number | Date;
};

type RatingItem = {
    id?: string | number;
    fromUserName: string;
    stars: number;
    date: string | number | Date;
    comment?: string;
};

interface ProfileContentProps {
    activeTab: string;
    books?: BookCopy[];
    wishlist?: WishlistItem[];
    exchange?: ExchangeItem[];
    rating?: RatingItem[];
}

export const ProfileContent = ({
                                   activeTab,
                                   books = [],
                                   wishlist = [],
                                   exchange = [],
                                   rating = [],
                               }: ProfileContentProps) => {
    const renderEmptyState = (icon: React.ElementType, message: string, buttonTitle?: string, buttonLink?: string) => (
        <Box
            textAlign="center"
            py={tokens.spacing.xl}
            px={tokens.spacing.md}
            color="fg.muted"
        >
            <Icon as={icon} boxSize={12} mb={tokens.spacing.md} opacity={0.5} />
            <Text color="fg.muted" fontSize="sm">
                {message}
            </Text>
            {buttonTitle && (
                buttonLink ? (
                    <Link to={buttonLink}>
                        <Button mt={tokens.spacing.md}>{buttonTitle}</Button>
                    </Link>
                ) : (
                    <Button mt={tokens.spacing.md}>{buttonTitle}</Button>
                )
            )}
        </Box>
    );

    // Collection
    if (activeTab === 'collection') {
        if (books?.length === 0) {
            return renderEmptyState(BookOpen, "Aucun livre dans la collection", "Ajouter un livre à votre liste de souhait");
        }

        return (
            <Grid
                templateColumns={{
                    base: "1fr",
                    md: "repeat(2, 1fr)",
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)",
                }}
                gap={tokens.spacing.md}
            >
                {books?.map((book) => (
                    <BookCard key={book.id} book={book} viewMode="grid" />
                ))}
            </Grid>
        );
    }

    // Wishlist
    if (activeTab === 'wishlist') {
        if (wishlist.length === 0) {
            return renderEmptyState(
                Heart,
                "Aucun livre dans la liste de souhaits",
                "Ajouter un livre à votre liste de souhait",
                "/add-book-to-wishlist"
            );
        }

        return (
            <VStack
                gap={tokens.spacing.md}
                align="stretch"
            >
                {wishlist.map((item) => (
                    <Card.Root
                        key={item.id}
                        borderWidth="1px"
                        borderColor="gray.400"
                        borderRadius={tokens.radius.md}
                        bg="bg.surface"
                        transition="all 0.2s"
                        _hover={{ boxShadow: 'sm', transform: 'translateY(-2px)' }}
                    >
                        <Card.Body>
                            <Text fontWeight="bold" fontSize="lg" color="fg.default">
                                {item.title}
                            </Text>
                            <Text color="fg.muted" fontSize="sm" mt={1}>
                                {item.author}
                            </Text>
                        </Card.Body>
                    </Card.Root>
                ))}
            </VStack>
        );
    }

    // Exchange
    if (activeTab === 'exchange') {
        if (exchange.length === 0) {
            return renderEmptyState(Repeat, "Aucun échange récent", "Commencez à échanger des livres avec d'autres utilisateurs");
        }

        return (
            <VStack
                gap={tokens.spacing.md} align="stretch"
                mt={tokens.spacing.md}
            >
                {/* À décommenter quand les données seront disponibles */}
                {exchange.map((exchangeItem, idx: number) => (
                    <Card.Root
                        key={idx}
                        borderWidth="1px"
                        borderColor="border.default"
                        borderRadius={tokens.radius.md}
                        bg="bg.surface"
                        transition="all 0.2s"
                        _hover={{ boxShadow: 'sm' }}
                    >
                        <Card.Body>
                            <HStack justify="space-between" align="start">
                                <Box>
                                    <Text fontWeight="bold" fontSize="lg" color="fg.default">
                                        {exchangeItem.bookTitle}
                                    </Text>
                                    <Text color="fg.muted" fontSize="sm">
                                        {exchangeItem.bookAuthor}
                                    </Text>
                                    <Badge colorPalette="blue" mt={2}>
                                        {exchangeItem.type}
                                    </Badge>
                                </Box>
                                <Text fontSize="sm" color="fg.muted">
                                    {new Date(exchangeItem.date).toLocaleDateString('fr-FR')}
                                </Text>
                            </HStack>
                        </Card.Body>
                    </Card.Root>
                ))}
            </VStack>
        );
    }

    // Rating
    if (activeTab === 'rating') {
        if (rating.length === 0) {
            return renderEmptyState(
                Award,
                "Aucune note reçue",
                "Notez vos échanges pour recevoir des évaluations de la part des autres utilisateurs"
            );
        }

        return (
            <VStack gap={tokens.spacing.md} align="stretch">
                {rating.map((ratingItem, idx: number) => (
                    <Card.Root
                        key={idx}
                        borderWidth="1px"
                        borderColor="border.default"
                        borderRadius={tokens.radius.md}
                        bg="bg.surface"
                    >
                        <Card.Body>
                            <HStack justify="space-between" align="start" mb={2}>
                                <HStack gap={2}>
                                    <Text fontWeight="medium" color="fg.default">
                                        {ratingItem.fromUserName}
                                    </Text>
                                    <HStack gap={1}>
                                        {[...Array(5)].map((_, i) => (
                                            <Icon
                                                key={i}
                                                as={Star}
                                                boxSize={4}
                                                fill={i < ratingItem.stars ? "colorPalette.default" : "none"}
                                                color={i < ratingItem.stars ? "colorPalette.default" : "fg.muted"}
                                            />
                                        ))}
                                    </HStack>
                                </HStack>
                                <Text fontSize="sm" color="fg.muted">
                                    {new Date(ratingItem.date).toLocaleDateString('fr-FR')}
                                </Text>
                            </HStack>
                            {ratingItem.comment && (
                                <Text color="fg.muted" fontSize="sm" mt={2}>
                                    {ratingItem.comment}
                                </Text>
                            )}
                        </Card.Body>
                    </Card.Root>
                ))}
            </VStack>
        );
    }

    return null;
};