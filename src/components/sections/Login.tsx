import { Button, Card, Field, Input, Stack, Flex, Box, Heading } from "@chakra-ui/react";
import {LogoWithText} from "../layout/LogoWithText.tsx";

export const Login = () => {

    return (
        <Flex className="login-container" flexDirection="column" alignItems="center">
            <Box className="login-box">
                <LogoWithText title="BookSwap" direction="column" />
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    Connexion
                </Heading>
                <Flex className="login-button-login-register">
                    <Button size="md" variant="outline">Connexion</Button>
                    <Button size="md" variant="outline">S'inscrire</Button>
                </Flex>
                <Card.Root className="login-card">
                    <Card.Header>
                        <Card.Description>
                            Accédez à votre bibliothèque personnelle
                        </Card.Description>
                    </Card.Header>
                    <Card.Body>
                        <Stack gap="4" w="full" className="login-card-input">
                            <Field.Root className="login-box-field">
                                <Field.Label>Email : </Field.Label>
                                <Input className="login-box-input"/>
                            </Field.Root>
                            <Field.Root className="login-box-field">
                                <Field.Label>Mot de passe </Field.Label>
                                <Input type="password" className="login-box-input" />
                            </Field.Root>
                        </Stack>
                    </Card.Body>
                    <Card.Footer justifyContent="flex-end">
                        <Button variant="solid">Se connecter</Button>
                    </Card.Footer>
                </Card.Root>
            </Box>
        </Flex>
    );
};