import { Button, Card, Field, Input, Stack, Flex, Box, Heading } from "@chakra-ui/react";
import {LogoWithText} from "../layout/LogoWithText.tsx";
import { useNavigate } from "react-router-dom";
import {useState} from "react";


export const Registration = () => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("register");

    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };

    return (
        <Flex className="login-registration-box">
            <Box>
                <LogoWithText title="BookSwap" direction="column" />
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    Inscription
                </Heading>
                <Flex className="switchable-button-login-register">
                    <Button
                        variant={activeButton === "login" ? "solid" : "outline"}
                        className={`btn ${activeButton === "login" ? "" : "inactive"}`}
                        onClick={() => goto("/Login", "login")}
                    >
                        Connexion
                    </Button>
                    <Button
                        variant={activeButton === "register" ? "solid" : "outline"}
                        className={`btn ${activeButton === "register" ? "" : "inactive"}`}
                        onClick={() => goto("/Registration", "register")}
                    >
                        S'inscrire
                    </Button>
                </Flex>
                <Card.Root className="form" >
                    <Card.Header>
                        <Card.Description>
                            Créez votre compte gratuitement
                        </Card.Description>
                    </Card.Header>
                    <Card.Body>
                        <Stack gap="4" w="full" className="login-card-input, form-field">
                            <Box className="firstName-name-disposition">
                                <Field.Root>
                                    <Field.Label>Prénom : </Field.Label>
                                    <Input className="form-input" />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>Nom : </Field.Label>
                                    <Input className="form-input" />
                                </Field.Root>
                            </Box>
                            <Field.Root>
                                <Field.Label>Email : </Field.Label>
                                <Input className="form-input"/>
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Mot de passe : </Field.Label>
                                <Input type="password" className="form-input" />
                            </Field.Root>
                            <Field.Root>
                                <Field.Label>Confirmer le mot de passe : </Field.Label>
                                <Input type="password" className="form-input" />
                            </Field.Root>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="solid">S'inscrire</Button>
                    </Card.Footer>
                </Card.Root>
            </Box>
        </Flex>
    );
};