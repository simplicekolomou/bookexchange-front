import { Button, Card, Field, Input, Stack, Flex, Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {UnAuthenticatedNavbar} from "../layout/UnAuthenticatedNavbar.tsx";

export const Login = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("login");
    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };
    const {t} = useTranslation("auth");
    return (
        <Box minH="100vh">
            <UnAuthenticatedNavbar />
            <Flex className="login-registration-box">
                <Box>
                    <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                        {t("login.title")}
                    </Heading>
                    <Flex className="switchable-button-login-register">
                        <Button
                            variant={activeButton === "login" ? "solid" : "outline"}
                            className={`btn ${activeButton === "login" ? "" : "inactive"}`}
                            onClick={() => goto("/Login", "login")}
                        >
                            {t("login.action")}
                        </Button>
                        <Button
                            variant={activeButton === "register" ? "solid" : "outline"}
                            className={`btn ${activeButton === "register" ? "" : "inactive"}`}
                            onClick={() => goto("/Registration", "register")}
                        >
                            {t("registration.action")}
                        </Button>
                    </Flex>
                    <Card.Root className="form">
                        <Card.Header>
                            <Card.Description>
                                {t("login.description")}
                            </Card.Description>
                        </Card.Header>
                        <Card.Body>
                            <Stack gap="4" w="full" className="login-card-input form-field">
                                <Field.Root>
                                    <Field.Label>{t("field.email")} : </Field.Label>
                                    <Input className="form-input" />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>{t("field.password")} : </Field.Label>
                                    <Input type="password" className="form-input" />
                                </Field.Root>
                            </Stack>
                        </Card.Body>
                        <Card.Footer justifyContent="center">
                            <Button variant="solid" w="full">{t("login.action")}</Button>
                        </Card.Footer>
                    </Card.Root>
                </Box>
            </Flex>
        </Box>
    );
};