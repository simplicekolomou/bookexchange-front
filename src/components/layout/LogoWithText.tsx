import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

interface LogoWithTextProps {
    title: string;
    direction: string
    nbBooks?: number;
}

export const LogoWithText = ({ title, nbBooks, direction = "row" }: LogoWithTextProps) => {
    const {t} = useTranslation("common");
    return (
        <Box display={"flex"} flexDirection={"column"}>
            <Link to={"/"} style={{ textDecoration: "none", cursor: "pointer" }}>
                <Flex className="logo-with-text" flexDirection={direction} alignItems="center">
                    <Box className="logo-box" padding={0}>
                        <BookOpen color="white" />
                    </Box>
                    <Box mt={direction === "column" ? 2 : 0} ml={direction === "row" ? 2 : 0} padding={0}>
                        <Text className="logo-title">{title}</Text>
                    </Box>
                </Flex>
            </Link>
            <Box >
                {nbBooks !== undefined && <Text>{nbBooks} {t("common:nbBooks")}</Text>}
            </Box>
        </Box>
    );
};