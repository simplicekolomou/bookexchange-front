// typescript
// `src/features/message/sendMessage/pages/Messaging.tsx`
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

    // safe arrays (déjà sanitizées dans le hook mais double protection ici)
    const safeGroupChats = Array.isArray(groupChats) ? groupChats.filter(Boolean) as GroupChat[] : [];
    const safeActiveChats = Array.isArray(activeChats) ? activeChats.filter(Boolean) as GroupChat[] : [];

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

            {!isGroupError && safeGroupChats.length === 0 && (
                <Text color="fg.muted" textAlign="center" mt={tokens.spacing.lg}>
                    Aucune discussion pour le moment.
                </Text>
            )}

            <VStack align="stretch" gap={tokens.spacing.xs} mt={tokens.spacing.md}>
                {safeGroupChats.map((group: GroupChat, index) => {
                    const groupIdKey = String(group?.id ?? group?.id ?? `g-${index}`);
                    const isActive = safeActiveChats.some((g) => String(g?.id) === String(group?.id));
                    return (
                        <MessageCard
                            key={groupIdKey}
                            group={group}
                            isActive={isActive}
                            onSelected={(g) => { if (g) openChat(g); }}
                        />
                    );
                })}
            </VStack>

            {safeActiveChats.map((group, idx) => (
                <ChatBox
                    key={String(group?.id ?? `active-${idx}`)}
                    chatGroup={group}
                    open={true}
                    onClose={() => closeChat(group?.id ?? `active-${idx}`)}
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
                onGroupCreated={openChat}
            />
        </Box>
    );
};
