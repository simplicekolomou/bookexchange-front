import { Box, VStack, Spinner, Text, Button, Flex } from "@chakra-ui/react";
import { ChatBox } from "../components/ChatBox";
import { MessageCard } from "../components/MessageCard";
import { MessageTabs } from "../components/MessageTabs";
import { CreateGroupChat } from "../components/CreateGroupChat";
import { CreateDirectChat } from "../components/CreateDirectChat";
import { tokens } from "../../../../theme/theme";
import { useMessagingController } from "../hooks/useMessagingController";
import type { Chat } from "../../types/message.types";

export const Messaging = () => {
    const {
        chats,
        isChatLoading,
        isChatError,
        activeChats,
        openChat,
        closeChat,
        value,
        show,
        t,
        isChatBoxOpen,
        isSendMessageBoxOpen,
        handleCloseChatBox,
        handleCloseSendMessageBox,
        handleTabChange
    } = useMessagingController();

    if (isChatLoading) {
        return (
            <Flex justify="center" align="center" minH="200px">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }

    return (
        <Box
            maxW="100%"
            minH="75vh"
            mx="auto"
            p={tokens.spacing.md}
            borderRadius={tokens.radius.lg}
            boxShadow="sm"
        >
            {show && (
                <Button
                    variant="solid"
                    colorScheme="blue"
                    size="sm"
                    mb={tokens.spacing.md}
                >
                    {t("notification:question")}
                </Button>
            )}

            <MessageTabs value={value} onChange={handleTabChange} />

            {isChatError && (
                <Text color={tokens.colors.textMuted} textAlign="center" mt={tokens.spacing.md}>
                    Erreur de chargement des discussions
                </Text>
            )}

            {!isChatError && chats.length === 0 && (
                <Text color="fg.muted" textAlign="center" mt={tokens.spacing.lg}>
                    Aucune discussion pour le moment.
                </Text>
            )}

            <VStack align="stretch" gap={tokens.spacing.xs} mt={tokens.spacing.md}>
                {chats.map((chat: Chat, index) => {
                    const chatIdKey = chat?.id ? String(chat.id) : `g-${index}`;
                    const isActive = activeChats.some((g) => String(g?.id ?? "") === String(chat?.id ?? ""));
                    return (
                        <MessageCard
                            key={chatIdKey}
                            chat={chat}
                            isActive={isActive}
                            onSelected={(g) => { if (g) openChat(g); }}
                        />
                    );
                })}
            </VStack>

            {activeChats
                .filter(Boolean) // enlever éventuels null/undefined
                .map((group, idx) => (
                    <ChatBox
                        key={String(group?.id ?? `active-${idx}`)}
                        chat={group}
                        open={true}
                        onClose={() => closeChat(group?.id ?? `active-${idx}`)}
                        stackIndex={idx}
                    />
                ))}

            <CreateDirectChat
                open={isSendMessageBoxOpen}
                onGroupSelected={openChat}
                onClose={handleCloseSendMessageBox}
            />
            <CreateGroupChat
                open={isChatBoxOpen}
                onClose={handleCloseChatBox}
                onChatSelected={openChat}
            />
        </Box>
    );
};
