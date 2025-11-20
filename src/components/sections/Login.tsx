import {Button, Card, Field, Input, Stack, Flex, Box, Heading, Alert} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
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
    const [login, {isSuccess: isLoginSuccess, isError: isLoginError, error: loginError}] = useLoginMutation()
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


    const handleSubmit = async (e: React.FormEvent) => {
        setLocalError('')
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError(t("validation.invalidEmail"));
            return;
        }

        if(!formData.email || !formData.password){
            setLocalError("Tous les champs sont obligatoires!")
            return
        }
        try {
            const result = await login(formData).unwrap()
            dispatch(setCredentials(result))
        } catch (error) {
            const err = (error as any)?.data?.error
            if(err === "Bad Request" || err ==="Unauthorized"){
                setLocalError("Adresse email ou mot de passe incorrect!")
            }

        }
    };

    useEffect(() =>{
        if(isLoginSuccess){
            if(isLoginSuccess){
                navigate("/collection");
            }
        }
        }, [isLoginSuccess])
    useEffect(() => {
        if(isLoginError){
            const err = (loginError as any)?.data.error
            if(err === "Bad Request" || err ==="Unauthorized"){
                setLocalError("Adresse email ou mot de passe incorrect!")
            }
        }
    }, [isLoginError]);

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
                                {localError && (
                                    <Alert.Root status="error" mb={4} borderRadius="md">
                                        {localError}
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
