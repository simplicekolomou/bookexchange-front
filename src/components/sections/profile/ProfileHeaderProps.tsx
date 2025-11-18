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

interface ProfileHeaderProps {
    isOwnProfile: boolean;
    isBlocked: boolean;
    onBack: () => void;
    onMessage: () => void;
    onBlock: () => void;
    onShowBlockDialog: () => void;
}

export const ProfileHeader = ({
                                  isOwnProfile,
                                  isBlocked,
                                  onBack,
                                  onMessage,
                                  onShowBlockDialog,
                              }: ProfileHeaderProps) => {
    return (
        <Box>
            {/* Bouton retour */}
            <Button variant="ghost" onClick={onBack} mb={6} className="btn-back-profile">
                <ArrowLeft size={16} />
                <Text ml={2}>Retour</Text>
            </Button>

            {/* Carte d'en-tête */}
            <Box bg="white" borderRadius="lg" p={6} boxShadow="sm" mb={8}>
                <Flex justify="space-between" align="start">
                    <Flex align="center" gap={4}>
                        <Avatar.Root size="xl" >
                            <Avatar.Image src={""/*user?.avatar*/}/>
                            <Avatar.Fallback fontSize="2xl">
                                {/*user?.firstName[0]}{user?.lastName[0]*/}
                            </Avatar.Fallback>
                        </Avatar.Root>
                        <VStack align="start" gap={2}>
                            <Text fontSize="2xl" fontWeight="bold">
                                {/*user?.firstName} {user?.lastName*/}
                            </Text>
                            {/*user?.contry && (
                                <Text color="gray.600">
                                    📍 {user?.contry}
                                </Text>
                            )*/}
                            <HStack>
                                <Star size={16} fill="yellow" color="yellow" />
                                <Text fontWeight="medium">{/*averageRating*/}</Text>
                                <Text fontSize="sm" color="gray.500">
                                    ({/*ratingsCount*/} avis)
                                </Text>
                            </HStack>
                        </VStack>
                    </Flex>

                    {!isOwnProfile && (
                        <HStack>
                            <MessageCircle size={16} />
                            <Button onClick={onMessage}>
                                Message
                            </Button>
                            <Ban size={16} />
                            <Button
                                variant={isBlocked ? "solid" : "outline"}
                                onClick={onShowBlockDialog}
                            >
                                {isBlocked ? "Débloquer" : "Bloquer"}
                            </Button>
                        </HStack>
                    )}
                </Flex>

                {/*user?.bio && (
                    <Text color="gray.600" mt={4}>
                        {user?.bio}
                    </Text>
                )*/}
            </Box>
        </Box>
    );
};