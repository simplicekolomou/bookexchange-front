import {
    Box, IconButton, Input, VStack,
    Text, HStack, Icon, CloseButton,
} from "@chakra-ui/react";
import { SendHorizonalIcon, Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";
import type { GroupChat, Message } from "../../types/message.types.ts";
import { useSendMessageController } from "../hooks/useSendMessageController.ts"; // ✅ hook allégé

interface ChatBoxProps {
    chatGroup?: GroupChat | null;
    onClose: () => void;
    open: boolean;
    stackIndex?: number;
}

const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const ChatBox = ({ chatGroup, onClose, open, stackIndex = 0 }: ChatBoxProps) => {
    const [minimized, setMinimized] = useState(false);
    const rightOffset = 132 + stackIndex * 370;

    // ✅ uniquement les props du hook allégé
    const controller = useSendMessageController({ chatGroup, open });

    if (!open || !controller?.messages) return null;

    const { messages, myId, message, setMessage, handleSendMessage, bottomRef } = controller;

    return (
        <Box
            position="fixed"
            bottom="calc(var(--footer-height, 64px) + 30px)"
            right={`${rightOffset}px`}
            zIndex="dropdown"
            width="350px"
            pointerEvents="auto"
        >
            {minimized ? (
                <Box display="flex" justifyContent="flex-end" p={1}>
                    <IconButton
                        aria-label="Ouvrir le chat"
                        onClick={() => setMinimized(false)}
                        colorScheme="blue"
                        borderRadius="full"
                        size="lg"
                        boxShadow="lg"
                    >
                        <Icon as={Maximize2} boxSize={4} />
                    </IconButton>
                </Box>
            ) : (
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
                            {chatGroup?.name ?? "Chat"}
                        </Text>
                        <HStack gap={1}>
                            <IconButton
                                aria-label="Minimiser"
                                size="xs"
                                variant="ghost"
                                color="white"
                                _hover={{ bg: "whiteAlpha.300" }}
                                onClick={() => setMinimized(true)}
                            >
                                <Icon as={Minimize2} boxSize={3} />
                            </IconButton>
                            <CloseButton
                                size="sm"
                                color="white"
                                _hover={{ bg: "whiteAlpha.300" }}
                                onClick={onClose}
                            />
                        </HStack>
                    </HStack>

                    {/* Zone messages */}
                    <Box
                        height="400px"
                        overflowY="auto"
                        p={3}
                        aria-live="polite"
                        aria-label="Zone de messages"
                    >
                        {messages.length === 0 ? (
                            <Box h="100%" display="flex" alignItems="center" justifyContent="center">
                                <Text fontSize="xs" color="fg.muted" textAlign="center">
                                    Aucun message pour l'instant.
                                    <br /> Soyez le premier à écrire !
                                </Text>
                            </Box>
                        ) : (
                            <VStack align="stretch" gap={2}>
                                {messages.map((msg: Message) => {
                                    const isMe = msg.senderId === myId;
                                    return (
                                        <Box
                                            key={msg.id}
                                            alignSelf={isMe ? "flex-end" : "flex-start"}
                                            bg={isMe ? "colorPalette.default" : "bg.subtle"}
                                            color={isMe ? "white" : "fg.default"}
                                            px={3}
                                            py={2}
                                            borderRadius="lg"
                                            maxW="80%"
                                            boxShadow="sm"
                                        >
                                            <Text fontSize="sm" wordBreak="break-word">
                                                {msg.content}
                                            </Text>
                                            <Text
                                                fontSize="xs"
                                                opacity={0.6}
                                                mt={0.5}
                                                textAlign={isMe ? "right" : "left"}
                                            >
                                                {formatTime(msg.sendTime)}
                                            </Text>
                                        </Box>
                                    );
                                })}
                                <div ref={bottomRef} />
                            </VStack>
                        )}
                    </Box>

                    {/* Saisie */}
                    <HStack p={2} borderTopWidth="1px" borderColor="border.default" gap={2}>
                        <Input
                            value={message}
                            placeholder="Écrire un message…"
                            size="sm"
                            bg="bg.subtle"
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(message);
                                }
                            }}
                            aria-label="Écrire un message"
                            autoFocus
                            borderColor="gray.300"
                        />
                        <IconButton
                            aria-label="Envoyer"
                            size="sm"
                            colorScheme="blue"
                            disabled={!message.trim()}
                            onClick={() => handleSendMessage(message)}
                        >
                            <Icon as={SendHorizonalIcon} boxSize={4} />
                        </IconButton>
                    </HStack>
                </Box>
            )}
        </Box>
    );
};