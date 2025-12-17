import {
    Box,
    Button,
    Avatar,
    Text,
    Flex,
    HStack,
    VStack,
} from '@chakra-ui/react';
import { ArrowLeft, MessageCircle, Ban, Star } from 'lucide-react';
import type { UserProfile } from '../../../types/profile.types';

interface ProfileHeaderProps {
    isOwnProfile: boolean;
    onBack: () => void;
    onMessage: () => void;
    user?: UserProfile;
    ratingsCount?: number | 0;
    averageRating?: number | 0;
}

export const ProfileHeader = ({
                                  isOwnProfile,
                                  onBack,
                                  onMessage,
                                  user,
                                  ratingsCount,
                                  averageRating,
                              }: ProfileHeaderProps) => {
    return (
        <Box>
            {/* Bouton retour */}
            <Button variant="ghost" onClick={onBack} mb={6} color="fg.default" _hover={{ bg: 'bg.subtle' }}>
                <ArrowLeft size={16} color="currentColor" />
                <Text ml={2} color="fg.default">Retour</Text>
            </Button>

            {/* Carte d'en-tête */}
            <Box
                bg="bg.surface"
                borderRadius="lg"
                p={6}
                mb={8}
                borderWidth="2px"
                borderColor="border.default"
                color="fg.default"
            >
                <Flex justify="space-between" align="start">
                    <Flex align="center" gap={4}>
                        <Box display="flex" flexDirection="column" gap={3} flex="auto" ml={2} alignItems="flex-start">
                            <Avatar.Root size="xl">
                                <Avatar.Image src={"" /* user?.avatar */} />
                                <Avatar.Fallback fontSize="2xl" />
                            </Avatar.Root>
                        </Box>
                        <VStack align="start" gap={2}>
                            <Text fontWeight="bold" color="fg.default">
                                {user?.firstName} {user?.lastName}
                            </Text>
                            <HStack>
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const filled = i < Math.max(0, Math.min(5, Math.round(Number(averageRating ?? 0))));
                                    return (
                                        <Box as="span" key={i} color={filled ? 'colorPalette.default' : 'fg.muted'}>
                                            <Star
                                                size={16}
                                                color="currentColor"
                                                fill={filled ? "currentColor" : "none"}
                                            />
                                        </Box>
                                    );
                                })}
                                <Text fontSize="sm" color="fg.muted">
                                    ({ratingsCount ?? 0} avis)
                                </Text>
                            </HStack>
                        </VStack>
                    </Flex>

                    {!isOwnProfile && (
                        <HStack color="fg.default">
                            <MessageCircle size={16} color="currentColor" />
                            <Button onClick={onMessage} color="fg.default" variant="ghost" _hover={{ bg: 'bg.subtle' }}>
                                Message
                            </Button>
                            <Ban size={16} color="currentColor" />
                        </HStack>
                    )}
                </Flex>

                {user?.bio && (
                    <Text color="fg.muted" mt={4}>
                        {user?.bio}
                    </Text>
                )}
            </Box>
        </Box>
    );
};
