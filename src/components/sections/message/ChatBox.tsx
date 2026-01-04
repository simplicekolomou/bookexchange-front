import {
    Box,
    CloseButton,
    Drawer,
    HStack,
    IconButton,
    Input,
    Portal,
    Text,
    VStack,
} from "@chakra-ui/react";
import type { GroupChat } from "../../../types/message.types.ts";
import { SendHorizonalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { tokens } from "../../ui/theme.ts";
import { webSocketService } from "../../../features/message/webSocket/webSocket.ts";
import {useGetMessagesByGroupChatQuery} from "../../../features/message/messageApi.ts";

interface ChatBoxProps {
    chatGroup: GroupChat | null;
    onClose: () => void;
    open: boolean;
}
export const ChatBox = ({ chatGroup, onClose, open }: ChatBoxProps) => {
    const [message, setMessage] = useState("");
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const chatId = chatGroup?.id;

    // passez chatId, et skip quand absent
    const { data: messages = [] } = useGetMessagesByGroupChatQuery(chatId!, {
        skip: !chatId,
    });

    const myId = chatGroup?.myMembership?.user.id;

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    if (!chatGroup) return null;

    const handleSendMessage = (text: string) => {
        if (!text.trim()) return;

        if (!chatGroup) return;

        // Message pour un chat existant
        webSocketService.sendMessage({
            groupChatId: chatGroup.id,
            content: text,
        });

        setMessage(""); // reset input
    };

    return (
        <Drawer.Root
            open={open}
            onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
        >
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner
                    padding={{ base: 0, md: 4 }}
                >
                    <Drawer.Content
                        rounded={{ base: "none", md: "xl" }}
                        h={{ base: "90%", md: "100%" }}
                        bg={tokens.colors.messageBox}
                        display="flex"
                        flexDirection="column"
                    >
                        <Drawer.Header borderBottomWidth="1px">
                            <Drawer.Title>{chatGroup.name}</Drawer.Title>
                        </Drawer.Header>

                        <Drawer.Body flex="1" overflowY="auto">
                            <VStack align="stretch" gap={3}>
                                {messages.map((msg) => {
                                    const isMe = msg.sender.id === myId;
                                    return (
                                        <Box
                                            key={msg.id}
                                            alignSelf={isMe ? "flex-end" : "flex-start"}
                                            bg={isMe ? "blue.500" : "gray.100"}
                                            color={isMe ? "white" : "black"}
                                            px={3}
                                            py={2}
                                            borderRadius="lg"
                                            maxW="80%"
                                        >
                                            <Text fontSize="sm">{msg.content}</Text>
                                            <Text fontSize="xs" opacity={0.6} mt={1}>
                                                {msg.sendTime instanceof Date ? msg.sendTime.toLocaleTimeString() : new Date(msg.sendTime).toLocaleTimeString()}
                                            </Text>
                                        </Box>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </VStack>
                        </Drawer.Body>

                        <Drawer.Footer borderTopWidth="1px">
                            <HStack w="100%">
                                <Input
                                    value={message}
                                    placeholder="Écrire un message…"
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage(message)}
                                    aria-label="Écrire un message"
                                />
                                <IconButton
                                    aria-label="Envoyer"
                                    onClick={() => handleSendMessage(message)}
                                >
                                    <SendHorizonalIcon />
                                </IconButton>
                            </HStack>
                            <Drawer.CloseTrigger asChild bg={"gray.300"}>
                                <CloseButton size="sm" onClick={onClose} />
                            </Drawer.CloseTrigger>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}