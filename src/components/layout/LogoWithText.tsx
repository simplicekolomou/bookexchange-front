import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";
import {useNavigate} from "react-router-dom";

interface LogoWithTextProps {
    title: string;
    direction: string
}

export const LogoWithText = ({ title, direction = "row" }: LogoWithTextProps & { direction?: "row" | "column" }) => {
    const navigate = useNavigate();
    const goto = (link: string) => {
        navigate(link);
    };
    return (
        <a onClick={() => goto("/")} style={{ textDecoration: "none", cursor: "pointer" }}>
            <Flex className="logo-with-text" flexDirection={direction} alignItems="center">
                <Box className="logo-box" padding={0}>
                    <BookOpen color="white" />
                </Box>
                <Box mt={direction === "column" ? 2 : 0} ml={direction === "row" ? 2 : 0} padding={0}>
                    <Text className="logo-title">{title}</Text>
                </Box>
            </Flex>
        </a>
    );
};