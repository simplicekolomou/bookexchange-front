import {
    Box,
    Button,
    Avatar,
    Text,
    Flex,
    HStack,
    VStack,
    Icon,
} from '@chakra-ui/react';
import { ArrowLeft, MessageCircle, Ban, Star } from 'lucide-react';
import type { UserProfile } from '../types/profile.types.ts';
import {tokens} from "../../../../theme/theme.ts";
import {useProfileController} from "../hook/useProfileController.ts";

interface ProfileHeaderProps {
    isOwnProfile: boolean;
    onBack: () => void;
    onMessage: () => void;
    user?: UserProfile | null;
    averageRating?: number;
}

export const ProfileHeader = ({
                                  isOwnProfile,
                                  onBack,
                                  onMessage,
                                  user,
                                  averageRating,
                              }: ProfileHeaderProps) => {
    const {starRating, initials} = useProfileController(averageRating);

    return (
        <Box>
            {/* Bouton retour */}
            <Button
                variant="ghost"
                onClick={onBack}
                mb={tokens.spacing.lg}
                color="fg.default"
                _hover={{
                    bg: 'bg.subtle',
                    transform: 'translateX(-2px)',
                }}
                transition="all 0.2s"
            >
                <Icon as={ArrowLeft} boxSize={4} />
                <Text ml={2} color="fg.default">Retour</Text>
            </Button>

            {/* Carte d'en-tête */}
            <Box
                bg="bg.surface"
                borderRadius={tokens.radius.lg}
                p={tokens.spacing.lg}
                mb={tokens.spacing.xl}
                borderWidth="1px"
                borderColor="border.default"
                color="fg.default"
                boxShadow="sm"
                transition="box-shadow 0.2s"
                _hover={{ boxShadow: 'md' }}
            >
                <Flex
                    direction={{ base: 'column', sm: 'row' }}
                    justify="space-between"
                    align={{ base: 'center', sm: 'start' }}
                    gap={4}
                >
                    <Flex
                        align={{ base: 'center', sm: 'start' }}
                        direction={{ base: 'column', sm: 'row' }}
                        gap={4}
                        flex="1"
                    >
                        {/* Avatar */}
                        <Avatar.Root size="xl">
                            <Avatar.Fallback bg="colorPalette.default" color="white" fontWeight="bold">
                                {initials || '?'}
                            </Avatar.Fallback>
                            <Avatar.Image src={user?.profilePicture ?? undefined} />
                        </Avatar.Root>

                        {/* Infos utilisateur */}
                        <VStack align={{ base: 'center', sm: 'start' }} gap={2} flex="1">
                            <Text fontWeight="bold" fontSize="xl" color="fg.default">
                                {user?.firstName} {user?.lastName}
                            </Text>
                            <HStack>
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const filled = i < starRating;
                                    return (
                                        <Box as="span" key={i} color={filled ? 'colorPalette.default' : 'fg.muted'}>
                                            <Icon
                                                as={Star}
                                                boxSize={4}
                                                fill={filled ? 'currentColor' : 'none'}
                                            />
                                        </Box>
                                    );
                                })}
                                <Text fontSize="sm" color="fg.muted">
                                    ({starRating} avis)
                                </Text>
                            </HStack>
                        </VStack>
                    </Flex>

                    {/* Actions pour non-propriétaire */}
                    {!isOwnProfile && (
                        <HStack gap={3} color="fg.default">
                            <Button
                                onClick={onMessage}
                                variant="ghost"
                                size="sm"
                                _hover={{ bg: 'bg.subtle', transform: 'scale(1.02)' }}
                                transition="all 0.2s"
                            >
                                <Icon as={MessageCircle} boxSize={4} />
                                Message
                            </Button>
                            <Icon as={Ban} boxSize={5} color="fg.muted" />
                        </HStack>
                    )}
                </Flex>

                {/* Bio */}
                {user?.bio && (
                    <Text color="fg.muted" mt={tokens.spacing.md} fontSize="sm">
                        {user.bio}
                    </Text>
                )}
            </Box>
        </Box>
    );
};