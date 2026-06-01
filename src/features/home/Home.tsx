import React from "react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ArrowRight, Library, Users, MessageCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { tokens } from "../../theme/theme.ts";
import {Link} from "react-router-dom";

export const Home: React.FC = () => {
    const { t } = useTranslation("home");
    const rawTitles = t("titles", { returnObjects: true });
    const rawTexts = t("texts", { returnObjects: true });

    const titles = Array.isArray(rawTitles) ? rawTitles : Object.values(rawTitles as Record<string, string>);
    const texts = Array.isArray(rawTexts) ? rawTexts : Object.values(rawTexts as Record<string, string>);

    const icons = [<Library key="lib" />, <Users key="users" />, <MessageCircle key="msg" />];
    const accentBgs = ["accent.50", "accent.100", "accent.200"];
    const accentColors = ["accent.700", "brand.600", "brand.700"];
    const primaryHoverToken = tokens.colors.primaryHover;

    return (
        <Box bg="bg.canvas" minH="100vh" py={{ base: 8, md: 12 }}>
            <Box as="section" maxW="100%" mx="auto" px={{ base: 4, md: 8 }} textAlign="center">
                <Heading as="h1" mb={2}>
                    {t("slogan")}
                </Heading>
                <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted" mb="6">
                    {t("subSlogan")}
                </Text>
                <Link to="/login">
                     <Button
                        size="lg"
                        variant="outline"
                        bg={tokens.colors.primary}
                        _hover={{ bg: primaryHoverToken, color: "white" }}
                        color="white"
                        mb={8}
                    >
                        {t("accountCreation")}<ArrowRight />
                    </Button>
                </Link>

                <Flex justify="center" flexDirection={{ base: "column", md: "row" }} gap="6" wrap="wrap">
                    {titles.map((title, index) => (
                        <Box
                            key={index}
                            width={{ base: "100%", sm: "320px" }}
                            mt={6}
                            borderRadius="lg"
                            bg="bg.surface"
                            p={4}
                            border="1px solid"
                            borderColor="border.default"
                            boxShadow="sm"
                        >
                            <Box
                                w="3.5rem"
                                h="3.5rem"
                                bg={accentBgs[index % accentBgs.length]}
                                borderRadius="xl"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                mx="auto"
                                mb={4}
                                color={accentColors[index % accentColors.length]}
                            >
                                {icons[index % icons.length]}
                            </Box>

                            <Heading as="h3" size="md" mt={2} color="fg.default">
                                {title}
                            </Heading>
                            <Text color="fg.muted" mt={2}>
                                {texts[index] ?? ""}
                            </Text>
                        </Box>
                    ))}
                </Flex>
            </Box>
        </Box>
    );
};
