import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme/theme.ts";

interface LogoWithTextProps {
    title: string;
    direction?: "row" | "column";
    nbBooks?: number;
}

export const LogoWithText: React.FC<LogoWithTextProps> = ({
                                                              title,
                                                              nbBooks,
                                                              direction = "row",
                                                          }) => {
    const { t } = useTranslation("common");

    return (
        <Box display="flex" flexDirection="column">
            <Link to="/" style={{ textDecoration: "none", cursor: "pointer" }}>
                <Flex alignItems="center" flexDirection={direction}>
                    <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        boxSize={tokens.spacing.lg}
                        bg={tokens.colors.primary}
                        borderRadius={5}
                        height={10}
                        width={10}
                        padding="0"
                    >
                        <BookOpen color="white" />
                    </Box>

                    <Box
                        ml={direction === "row" ? tokens.spacing.sm : 0}
                        mt={direction === "column" ? tokens.spacing.sm : 0}
                        padding="0"
                    >
                        <Text color={tokens.colors.text} fontWeight="semibold">
                            {title}
                        </Text>
                    </Box>
                </Flex>
            </Link>

            {nbBooks !== undefined && (
                <Box mt={tokens.spacing.xs}>
                    <Text color={tokens.colors.textMuted} fontSize="sm">
                        {nbBooks} {t("nbBooks")}
                    </Text>
                </Box>
            )}
        </Box>
    );
};
