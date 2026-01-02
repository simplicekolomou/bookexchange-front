import type { GroupChat } from "../../../types/message.types.ts";
import { Box, Flex, Text } from "@chakra-ui/react";
import { tokens } from "../../ui/theme.ts";
import React from "react";

type MessageCardProps = {
    group: GroupChat;
    isActive?: boolean;
    onSelected: (group: GroupChat) => void;
};

export const MessageCard = ({ group, onSelected, isActive = false }: MessageCardProps) => {
    const handleActivate = () => onSelected(group);
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleActivate();
        }
    };

    const last = group.lastMessage;
    const formattedDate = last
        ? (last.sendTime instanceof Date
            ? last.sendTime.toLocaleString()
            : new Date(last.sendTime).toLocaleString())
        : "";

    return (
        <Box
            borderWidth="1px"
            borderColor={isActive ? "blue.400" : tokens.colors.border}
            borderRadius="md"
            mb={1}
            bg={tokens.colors.surface}
            p={2}
            cursor="pointer"
            role="button"
            aria-pressed={!!isActive}
            tabIndex={0}
            onClick={handleActivate}
            onKeyDown={handleKeyDown}
            _hover={{ boxShadow: "sm" }}
            boxShadow={isActive ? "outline" : undefined}
        >
            <Flex flexDirection="column">
                <Box fontWeight="bold">
                    <Text>{group.name}</Text>
                </Box>
                <Box>
                    <Text fontStyle={"italic"} fontSize={"xs"}>{formattedDate}</Text>
                </Box>
            </Flex>
            <Box mt={2}>{last?.content ?? ""}</Box>
        </Box>
    );
}