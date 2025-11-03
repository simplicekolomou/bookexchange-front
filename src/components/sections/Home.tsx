import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { ArrowRight, Library, Users, MessageCircle } from "lucide-react";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {NavbarUnAuthenticatedUser} from "../layout/NavbarUnAuthenticatedUser.tsx";

export const Home = () => {
    const {t} = useTranslation("home");
    const titles = t("titles", { returnObjects: true });
    const textes = t("texts", { returnObjects: true });

    return (
        <>
            <NavbarUnAuthenticatedUser />
            <main>
                <Box as="section" textAlign="center" py={{ base: 12, md: 5 }} px={{ base: 4, md: 8 }} className="home">
                    <Heading as="h1" fontSize={{ base: "4xl", sm: "5xl", md: "6xl", lg: "3xl" }} fontWeight="bold" color="foreground" mb="6">
                        {t("slogan")}
                    </Heading>
                    <Text fontSize={{ base: "lg", md: "xl" }} color="muted" mb="8">
                        {t("subSlogan")}
                    </Text>
                    <Link to="/Login">
                        <Button maxW="xs" size="lg">
                            {t("accountCreation")}
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </Box>
            <Flex justify="center" flexDirection={["column", "row"]} gap="6" padding="10">
                {Object.values(titles).map((title, index) => (
                    <Box
                        key={index}
                        width={{ base: "100%", sm: "320px" }}
                        marginTop="6"
                        borderRadius="lg"
                        bg="white"
                        p="4"
                        border="1px solid #E2E8F0"
                    >
                        <Box
                            w="3.5rem"
                            h="3.5rem"
                            bg={["red.100", "green.100", "blue.100"][index]}
                            borderRadius="xl"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            m="0 auto"
                            mb="4"
                            color={["brown", "green.700", "red.700"][index]}
                        >
                            {[<Library />, <Users />, <MessageCircle />][index]}
                        </Box>
                        <Heading as="h3" size="md" mt="2">{title}</Heading>
                        <Text>{Object.values(textes)[index]}</Text>
                    </Box>
                ))}
            </Flex>
            </main>
        </>
    );
};