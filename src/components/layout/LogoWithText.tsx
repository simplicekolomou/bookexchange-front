import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";

interface LogoWithTextProps {
    title: string;
    subtitle?: string;
}

export const LogoWithText = ({ title }: LogoWithTextProps) => {
    return (
        <Flex className="logo-with-text">
            <Box className="logo-box">
                <BookOpen color="white" />
            </Box>
            <Box>
                <Text className="logo-title">{title}</Text>
            </Box>
        </Flex>
    );
};