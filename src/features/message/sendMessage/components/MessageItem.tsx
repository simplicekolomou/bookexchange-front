// File: `src/features/message/sendMessage/components/MessageItem.tsx`
import { Box, Text, Spinner } from "@chakra-ui/react";
import type { Message } from "../../types/message.types.ts";
import { useGetUserQuery } from "../../../auth/api/authApi.ts";

type LocalMessage = Message & { tempId?: string };

interface MessageItemProps {
    msg: LocalMessage;
    myId?: string;
}

const formatTime = (date: Date | string) =>
    new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export const MessageItem = ({ msg, myId }: MessageItemProps) => {
    const isMe = msg.senderId === myId;

    const { data: sender, isLoading } = useGetUserQuery(
        { userId: msg.senderId },
        { skip: !msg.senderId }
    );

    const senderName = isMe ? "Vous" : (
        isLoading ? null :
            sender ? `${sender.firstName} ${sender.lastName}` :
                "Utilisateur"
    );

    const bg = isMe ? "blue.500" : "gray.100";
    const color = isMe ? "white" : "blackAlpha.800";

    // coins différents pour effet bulle
    const bubbleProps = isMe
        ? {
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "6px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
        }
        : {
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "12px",
            borderBottomLeftRadius: "12px",
            borderBottomRightRadius: "12px",
        };

    return (
        <Box
            alignSelf={isMe ? "flex-end" : "flex-start"}
            bg={bg}
            color={color}
            px={3}
            py={2}
            maxW="80%"
            boxShadow="sm"
            {...bubbleProps}
        >
            <Text fontSize="xs" opacity={0.8} mb={1}>
                {senderName ?? <Spinner size="xs" />}
            </Text>

            <Text fontSize="sm" wordBreak="break-word">
                {msg.content}
            </Text>

            <Text
                fontSize="xs"
                opacity={0.7}
                mt={0.5}
                textAlign={isMe ? "right" : "left"}
            >
                {formatTime(msg.sendTime)}
            </Text>
        </Box>
    );
};