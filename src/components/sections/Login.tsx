import {Button, Card, Field, Input, Stack, Flex, Box, Heading, Alert} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useAppDispatch } from "../../app/hooks.ts";
import {setCredentials} from "../../features/auth/authSlice.ts";
import {useLoginMutation} from "../../features/auth/authApi.ts";

export const Login = () => {
    const { t } = useTranslation("auth");
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [activeButton, setActiveButton] = useState("login")
    const [login, {error: apiError}] = useLoginMutation()
    const [localError, setLocalError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Déterminer le message d'erreur à afficher
    const displayError = localError ||
        (apiError && ('data' in apiError
                ? (apiError.data as Error)?.message
                : t("login.error")
        ));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError(t("validation.invalidEmail"));
            return;
        }
        try {
            const result = await login(formData).unwrap()
            // Les credentials sont automatiquement mis à jour par le slice
            // via le extraReducers, mais on peut aussi les dispatcher manuellement :
            dispatch(setCredentials(result))
            navigate("/collection");
        } catch (error: unknown) {
            // Gestion d'erreur pour RTK Query
            const e = error as { message?: string; error?: string } | undefined;

            const errorMessage =
                e?.message ??
                e?.error ??
                t("login.error");

            setLocalError(errorMessage);
        }
    };

    return (
        <Box minH="100vh" bg="gray.50" py={5}>
            <Flex
                justify="center"
                align="center"
                className="login-registration-box"
            >
                <Box w={{ base: "100%", md: "70%" }}>
                    <form onSubmit={handleSubmit} method="POST">
                        <Heading as="h1" fontSize="3xl" mb="6">
                            {t("login.title")}
                        </Heading>
                        {/* Boutons de navigation */}
                        <Flex
                            className="switchable-button-login-register"
                            mb={6}
                            gap={2}
                        >
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
                                <Card.Description textAlign="center">
                                    {t("login.description")}
                                </Card.Description>
                            </Card.Header>
                            <Card.Body>

                                {/* Affichage des erreurs */}
                                {displayError && (
                                    <Alert.Root status="error" mb={4} borderRadius="md">
                                        {displayError}
                                    </Alert.Root>
                                )}

                                <Stack gap="4" w="full" className="login-card-input form-field">
                                    <Field.Root>
                                        <Field.Label>{t("field.email")} </Field.Label>
                                        <Input
                                            name="email"
                                            className="form-input"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>{t("field.password")} </Field.Label>
                                        <Input
                                            name="password"
                                            type="password"
                                            className="form-input"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </Field.Root>
                                </Stack>
                            </Card.Body>
                            <Card.Footer justifyContent="center">
                                <Button type="submit" variant="solid" w="full">{t("login.action")}</Button>
                            </Card.Footer>
                        </Card.Root>

                    </form>
                </Box>
            </Flex>
        </Box>
    );
};
