import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";

interface LogoWithTextProps {
    title: string;
    direction: string
}

export const LogoWithText = ({ title, direction = "row" }: LogoWithTextProps & { direction?: "row" | "column" }) => {
    return (
        <Flex className="logo-with-text" flexDirection={direction} alignItems="center">
            <Box className="logo-box" padding={0}>
                <BookOpen color="white" />
            </Box>
            <Box mt={direction === "column" ? 2 : 0} ml={direction === "row" ? 2 : 0} padding={0}>
                <Text className="logo-title">{title}</Text>
            </Box>
        </Flex>
    );
};