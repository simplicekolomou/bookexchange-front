import { Box, VStack, Spinner, Text, Button, Flex } from "@chakra-ui/react";
import { ChatBox } from "../components/ChatBox.tsx";
import { MessageCard } from "../components/MessageCard.tsx";
import { MessageTabs } from "../components/MessageTabs.tsx";
import { GroupBox } from "../components/GroupBox.tsx";
import { SendMessageBox } from "../components/SendMessageBox.tsx";
import { tokens } from "../../../../theme/theme.ts";
import { useMessagingController } from "../hooks/useMessagingController.ts";
import type { GroupChat } from "../../types/message.types.ts";

export const Messaging = () => {
    const {
        groupChats,
        isGroupLoading,
        isGroupError,
        activeChats,
        openChat,
        closeChat,
        value,
        setValue,
        show,
        open,
        handleSubscribeToPush,
        t,
    } = useMessagingController();

    if (isGroupLoading) {
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
            {show && open && (
                <Button
                    variant="solid"
                    colorScheme="blue"
                    size="sm"
                    mb={tokens.spacing.md}
                    onClick={handleSubscribeToPush}
                >
                    {t("notification:question")}
                </Button>
            )}

            <MessageTabs value={value} onChange={setValue} />

            {isGroupError && (
                <Text color={tokens.colors.textMuted} textAlign="center" mt={tokens.spacing.md}>
                    Erreur de chargement des discussions
                </Text>
            )}

            {!isGroupError && groupChats.length === 0 && (
                <Text color="fg.muted" textAlign="center" mt={tokens.spacing.lg}>
                    Aucune discussion pour le moment.
                </Text>
            )}

            <VStack align="stretch" gap={tokens.spacing.xs} mt={tokens.spacing.md}>
                {groupChats.map((group: GroupChat) => (
                    <MessageCard
                        key={group.id}
                        group={group}
                        isActive={activeChats.some((g) => g.id === group.id)}
                        onSelected={(g) => { if (g) openChat(g); }}
                    />
                ))}
            </VStack>

            {activeChats.map((group, idx) => (
                <ChatBox
                    key={group.id}
                    chatGroup={group}
                    open={true}
                    onClose={() => closeChat(group.id)}
                    stackIndex={idx}
                />
            ))}

            <SendMessageBox
                open={value === "sendMessage"}
                onGroupSelected={openChat}
                onClose={() => setValue("")}
            />
            <GroupBox
                open={value === "groups"}
                onClose={() => setValue("")}
                onGroupCreated={openChat} // ✅ ouvre directement la chatbox après création
            />
        </Box>
    );
};