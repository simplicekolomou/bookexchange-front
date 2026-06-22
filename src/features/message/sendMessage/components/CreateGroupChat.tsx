import {
    Box,
    Input,
    VStack,
    Text,
    HStack,
    Icon,
    CloseButton,
    CheckboxCard,
    Spinner,
    Button,
} from "@chakra-ui/react";
import { SendHorizonalIcon, SearchIcon } from "lucide-react";
import type { Chat } from "../../types/message.types.ts";
import {useCreateGroupChatController} from "../hooks/useCreateGroupChatController.ts";

interface GroupBoxProps {
    onClose: () => void;
    open: boolean;
    onChatSelected: (chat: Chat) => void;
    stackIndex?: number;
}

export const CreateGroupChat = ({ onClose, open, onChatSelected, stackIndex = 0 }: GroupBoxProps) => {
    const {
        users,
        isFetching,
        isLastPage,
        chatName,
        setChatName,
        selectedUserIds,
        toggleMember,
        handleScroll,
        handleCreateGroupChat,
        handleClose,
        isLoading,
        localError,
        t,
        searchTerm,
        setSearchTerm,
        isSearching,
    } = useCreateGroupChatController({ onClose, onChatSelected: onChatSelected });

    // Calcul de la position en fonction de l'index dans la pile(stackIndex)
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
                {/* Header (identique chat) */}
                <HStack
                    justify="space-between"
                    bg="colorPalette.default"
                    px={3}
                    py={2}
                    color="white"
                >
                    <Text fontWeight="bold" fontSize="sm">
                        {t("title")}
                    </Text>
                    <CloseButton
                        size="sm"
                        color="white"
                        _hover={{ bg: "whiteAlpha.300" }}
                        onClick={handleClose}
                    />
                </HStack>

                {/* Champ nom du groupe */}
                <Box p={3} borderBottomWidth="1px" borderColor="gray.500">
                    <Input
                        value={chatName}
                        onChange={(e) => setChatName(e.target.value)}
                        placeholder={t("groupNamePlaceholder") || "Nom du groupe"}
                        size="sm"
                        bg="bg.subtle"
                        borderColor="gray.300"
                        _hover={{ borderColor: "colorPalette.default" }}
                        transition="all 0.2s"
                        autoFocus
                    />
                </Box>

                {/* Barre de recherche */}
                <Box position="relative" mx="auto" maxW="320px" width="100%">
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
                        _hover={{ borderColor: "colorPalette.default" }}
                        transition="all 0.2s"
                        size="sm"
                        width="100%"
                        mt="5px"
                        pl={2}
                    />
                </Box>

                {/* Liste des utilisateurs */}
                <Box
                    height="400px"
                    overflowY="auto"
                    p={3}
                    aria-label="Liste des membres"
                    onScroll={handleScroll}
                >
                    {isSearching ? (
                        <HStack justify="center" py={4}>
                            <Spinner size="sm" color="colorPalette.default" />
                            <Text fontSize="xs" color="fg.muted">Recherche...</Text>
                        </HStack>
                    ) : (
                        <VStack align="stretch" gap={2}>
                            {users.length === 0 && searchTerm && !isFetching ? (
                                <Text textAlign="center" fontSize="xs" color="fg.muted" py={4}>
                                    Aucun utilisateur trouvé.
                                </Text>
                            ) : (
                                users.map((user) => (
                                    <CheckboxCard.Root
                                        key={user.id}
                                        size="sm"
                                        checked={selectedUserIds.includes(String(user.id))}
                                        onCheckedChange={() => toggleMember(String(user.id))}
                                        borderWidth="1px"
                                        borderColor="gray.300"
                                        borderRadius="lg"
                                        bg="bg.surface"
                                        transition="all 0.2s"
                                        _hover={{ bg: "bg.subtle", transform: "translateX(2px)" }}
                                    >
                                        <CheckboxCard.HiddenInput  />
                                        <CheckboxCard.Control>
                                            <CheckboxCard.Content>
                                                <CheckboxCard.Label>
                                                    {user.firstName} {user.lastName}
                                                </CheckboxCard.Label>
                                            </CheckboxCard.Content>
                                            <CheckboxCard.Indicator borderRadius="full" borderColor="gray.400"/>
                                        </CheckboxCard.Control>
                                    </CheckboxCard.Root>
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

                {/* Footer */}
                <HStack p={2} borderTopWidth="1px" borderColor="border.default" gap={2}>
                    {localError && (
                        <Text color="red.500" fontSize="xs" flex="1">
                            {localError}
                        </Text>
                    )}
                    <Button
                        size="sm"
                        colorScheme="blue"
                        loading={isLoading}
                        disabled={!chatName.trim() || selectedUserIds.length < 2}
                        onClick={handleCreateGroupChat}
                        gap={2}
                        flexShrink={0}
                    >
                        <Icon as={SendHorizonalIcon} boxSize={4} />
                        {t("actions.createGroup")}
                    </Button>
                </HStack>
            </Box>
        </Box>
    );
};