import {Button, Card, Field, Input, Stack, Flex, Box, Heading, Alert, } from "@chakra-ui/react";
import {Link, useNavigate} from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useAppDispatch } from "../../../app/hooks.ts";
import { setCredentials } from "../../../features/auth/authSlice.ts";
import { useLoginMutation } from "../../../features/auth/authApi.ts";
import { tokens } from "../../ui/theme.ts";
import {DoubleButton} from "../../layout/DoubleButton.tsx";
import type {UserProfile} from "../../../types/profile.types.ts";

export const Login = () => {
    const { t } = useTranslation("auth");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [login, { isSuccess: isLoginSuccess }] = useLoginMutation();
    const [localError, setLocalError] = useState('');

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        setLocalError('');
        e.preventDefault();
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError(t("validation.invalidEmail"));
            return;
        }

        if (!formData.email || !formData.password) {
            setLocalError(t("validation.requiredFields"));
            return;
        }
        try {
            const result = await login(formData).unwrap();
            dispatch(setCredentials(result));
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 401) {
                setLocalError(t("login.invalidCredentials"));
            } else {
                setLocalError(t("login.serverError"));
            }
        }
    };

    useEffect(() => {
        if (isLoginSuccess) {
            const user: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
            navigate(`/user/${user.id}/collection`);
        }
    }, [isLoginSuccess, navigate]);

    return (
        <Box minH="100vh" bg={tokens.colors.background} py={tokens.spacing.md}>
            <Flex
                justify="center"
                align="center"
            >
                <Box
                    w={{ base: "100%", md: "70%" }}
                    p={tokens.spacing.lg}
                    borderRadius={tokens.radius.xl}
                    bg={tokens.colors.surface}
                >
                    <form onSubmit={handleSubmit} method="POST">
                        <Heading as="h1" fontSize="3xl" mb={tokens.spacing.xl}>
                            {t("login.title")}
                        </Heading>

                        <DoubleButton />

                        <Card.Root className="login-card">
                            <Card.Header>
                                <Card.Description textAlign="center">
                                    {t("login.description")}
                                </Card.Description>
                            </Card.Header>
                            <Card.Body>
                                {localError && (
                                    <Alert.Root status="error" color={"red"} mb={tokens.spacing.md}>
                                        <Alert.Indicator />
                                        <Alert.Title>{localError}</Alert.Title>
                                    </Alert.Root>
                                )}

                                <Stack gap={tokens.spacing.md} w="full">
                                    <Field.Root>
                                        <Field.Label>{t("field.email")}</Field.Label>
                                        <Input
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            bg="transparent"
                                        />
                                    </Field.Root>
                                    <Field.Root>
                                        <Field.Label>{t("field.password")}</Field.Label>
                                        <Input
                                            name="password"
                                            type="password"
                                            className="form-input"
                                            value={formData.password}
                                            onChange={handleChange}
                                            bg="transparent"
                                        />
                                    </Field.Root>
                                </Stack>
                            </Card.Body>
                            <Card.Footer
                                justifyContent="center"
                                pt={tokens.spacing.md}
                                display="flex"
                                flexDirection="column"
                            >
                                <Button
                                    type="submit"
                                    variant="solid"
                                    w="full">
                                    {t("login.action")}
                                </Button>
                                <Link
                                    className="mt-4 text-center"
                                    to="/ForgotPassword"
                                >
                                    {t("login.passwordReset")}
                                </Link>
                            </Card.Footer>
                        </Card.Root>
                    </form>
                </Box>
            </Flex>
        </Box>
    );
};
