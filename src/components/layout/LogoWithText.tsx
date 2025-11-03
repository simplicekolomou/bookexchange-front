import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface LogoWithTextProps {
    title: string;
    direction: string
}

export const LogoWithText = ({direction = "row" }: LogoWithTextProps & { direction?: "row" | "column" }) => {
    const navigate = useNavigate();
    const {t} = useTranslation("common");
    return (
        <a onClick={() => navigate("/")} style={{ textDecoration: "none", cursor: "pointer" }}>
            <Flex className="logo-with-text" flexDirection={direction} alignItems="center">
                <Box className="logo-box" padding={0}>
                    <BookOpen color="white" />
                </Box>
                <Box mt={direction === "column" ? 2 : 0} ml={direction === "row" ? 2 : 0} padding={0}>
                    <Text className="logo-title">{t("brand.title")}</Text>
                </Box>
            </Flex>
        </a>
    );
};