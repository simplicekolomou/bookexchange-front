import {
    Box,
    Input,
    VStack,
    Text,
    HStack,
    Icon,
    CloseButton,
    Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "lucide-react";
import type { Chat } from "../../types/message.types.ts";
import { useCreateDirectChatController } from "../hooks/useCreateDirectChatController.ts";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";

interface SendMessageBoxProps {
    open?: boolean;
    onClose?: () => void;
    onGroupSelected?: (group: Chat) => void;
    stackIndex?: number;
}

export const CreateDirectChat = ({open, onClose, onGroupSelected, stackIndex = 0}: SendMessageBoxProps) => {
    const {
        users,               // liste des utilisateurs (paginer + recherche)
        isFetching,
        isLastPage,
        handleScroll,
        localError,
        t,
        handleUserClick,
        searchTerm,
        setSearchTerm,
        isSearching,
    } = useCreateDirectChatController({
        onChatSelected: onGroupSelected,
        onClose,
    });

    // Calcul de l'offset à droite en fonction de l'index de la pile(stackIndex)
    const rightOffset = 132 + stackIndex * 370;
    if (!open) return null;

    return (
        <Box
            position="fixed"
            bottom="calc(var(--footer-height, 64px) + 30px)"
            right={`${rightOffset}px`}
            zIndex="dropdown"
            width="350px"
            pointerEvents="auto"
        >
            <Box
                bg="bg.surface"
                borderRadius="lg"
                boxShadow="xl"
                overflow="hidden"
                display="flex"
                flexDirection="column"
            >
                {/* Header */}
                <HStack
                    justify="space-between"
                    bg="colorPalette.default"
                    px={3}
                    py={2}
                    color="white"
                >
                    <Text fontWeight="bold" fontSize="sm">
                        {t("sendMessage")}
                    </Text>
                    <CloseButton
                        size="sm"
                        color="white"
                        _hover={{bg: "whiteAlpha.300"}}
                        onClick={onClose}
                    />
                </HStack>

                {/* Barre de recherche */}
                <Box position="relative" mx="auto" maxW="320px" width="100%" mt={2}>
                    <Icon
                        as={SearchIcon}
                        boxSize={4}
                        color="fg.muted"
                        position="absolute"
                        left={3}
                        top="50%"
                        transform="translateY(-50%)"
                        pointerEvents="none"
                    />
                    <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={t("searchUsers") || "Rechercher un utilisateur..."}
                        bg="bg.subtle"
                        borderColor="gray.300"
                        _hover={{borderColor: "colorPalette.default"}}
                        transition="all 0.2s"
                        size="sm"
                        width="100%"
                        pl={8}
                    />
                </Box>

                {/* Liste des utilisateurs */}
                <Box
                    height="400px"
                    overflowY="auto"
                    p={3}
                    aria-label="Liste des utilisateurs"
                    onScroll={handleScroll}
                >
                    {isSearching ? (
                        <HStack justify="center" py={4}>
                            <Spinner size="sm" color="colorPalette.default"/>
                            <Text fontSize="xs" color="fg.muted">Recherche...</Text>
                        </HStack>
                    ) : (
                        <VStack align="stretch" gap={2}>
                            {users.length === 0 && searchTerm && !isFetching ? (
                                <Text textAlign="center" fontSize="xs" color="fg.muted" py={4}>
                                    Aucun utilisateur trouvé.
                                </Text>
                            ) : (
                                users.map((user: UserProfile) => (
                                    <Box
                                        key={user.id}
                                        p={3}
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        borderRadius="lg"
                                        cursor="pointer"
                                        bg="bg.surface"
                                        transition="all 0.2s"
                                        _hover={{ bg: "bg.subtle", transform: "translateX(2px)" }}
                                        onClick={() => handleUserClick(user)}
                                    >
                                        <Text fontSize="sm" fontWeight="medium">
                                            {user.firstName} {user.lastName}
                                        </Text>
                                    </Box>
                                ))
                            )}
                            {isFetching && !isSearching && (
                                <HStack justify="center" py={2}>
                                    <Spinner size="sm" color="colorPalette.default" />
                                </HStack>
                            )}
                            {isLastPage && !isFetching && !isSearching && users.length > 0 && (
                                <Text textAlign="center" fontSize="xs" color="fg.muted" py={2}>
                                    {t("endOfList")}
                                </Text>
                            )}
                        </VStack>
                    )}
                </Box>

                {/* Footer (juste l'erreur éventuelle) */}
                {localError && (
                    <HStack p={2} borderTopWidth="1px" borderColor="border.default" gap={2}>
                        <Text color="red.500" fontSize="xs" flex="1">
                            {localError}
                        </Text>
                    </HStack>
                )}
            </Box>
        </Box>
    );
};