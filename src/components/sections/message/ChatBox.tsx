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
import {useGetMessagesByGroupChatQuery, useSendMessageMutation} from "../../../features/message/messageApi.ts";
import {getCurrentUser} from "./hook/utils.ts";

interface ChatBoxProps {
    chatGroup?: GroupChat | null;
    onClose: () => void;
    open: boolean;
}
export const ChatBox = ({ chatGroup, onClose, open }: ChatBoxProps) => {
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const chatId = chatGroup?.id;
    const [sendMessage] = useSendMessageMutation();
    const { data: messages } = useGetMessagesByGroupChatQuery(chatId!, {
        skip: !chatId,
    });

    const myId = getCurrentUser()!.id;
    const [message, setMessage] = useState("");
    console.log("Mon ID est : ", myId);

    useEffect(() => {
        if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, open]);

    if (!chatGroup) return null;

    const handleSendMessage = async (text: string) => {
        if (!text.trim()) return;
        if (!chatGroup) return;
        try {
            await sendMessage({ groupChatId: chatGroup.id, content: text.trim() }).unwrap();
            setMessage("");
        } catch (error) {
            console.error(error);
        }
    };

    console.log("Les messages chargés sont : ", messages);
    if(!messages) return null;

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
                                    const isMe = msg.senderId === myId;
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
                                    color={tokens.colors.surface}
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