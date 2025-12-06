import {
    Button,
    Card,
    Field,
    Input,
    Stack,
    Flex,
    Box,
    Heading,
    Alert,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useRegisterMutation } from "../../../features/auth/authApi.ts";
import { useAppDispatch } from "../../../app/hooks.ts";
import { setCredentials } from "../../../features/auth/authSlice.ts";
import {tokens} from "../../ui/theme.ts";
import {DoubleButton} from "../../layout/DoubleButton.tsx";

export const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [localError, setLocalError] = useState('');
    const [register, {isSuccess: isRegisterSuccess}] = useRegisterMutation()

    const { t } = useTranslation("auth");

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        confirmPassword: '',
    });

    // Effacer les erreurs quand l'utilisateur modifie les champs
    useEffect(() => {
        setLocalError('');
    }, [formData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation côté client
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
            setLocalError(t("validation.requiredFields"));
            return;
        }

        if (formData.password.length < 6) {
            setLocalError(t("validation.passwordLength"));
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError(t("validation.passwordsMustMatch"));
            return;
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setLocalError(t("validation.invalidEmail"));
            return;
        }

        const newUser = {
            email: formData.email.trim(),
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            password: formData.password,
        };

        try {
            const result = await register(newUser).unwrap();

            // Dispatch uniquement le token reçu (backend renvoie accessToken)
            dispatch(setCredentials(result));

        } catch (error) {
            const status = (error as { status?: number })?.status;
            if(status === 400) {
                setLocalError(t("registration.existingEmail"));
                return;
            }else {
                setLocalError(t("registration.serverError"));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if(isRegisterSuccess){
            navigate("/collection", { replace: true });
        }
    }, [isRegisterSuccess, navigate]);

    // Props réutilisables pour tous les Input, basés sur les tokens sémantiques du thème
    const inputProps = {
        borderWidth: "2px",
        borderColor: "border.default",
        borderRadius: "md",
        bg: "bg.surface",
        color: "fg.default",
        _placeholder: { color: "fg.placeholder" },
        _hover: { borderColor: "colorPalette.emphasized" },
        _focus: {
            borderColor: "colorPalette.emphasized",
            boxShadow: "0 0 0 4px rgba(59,130,246,0.12)",
            outline: "none",
        },
    } as const;

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
                        <Heading
                            as="h1"
                            fontSize="3xl"
                            mb={tokens.spacing.xl}
                        >
                            {t("registration.title")}
                        </Heading>

                        {/* Boutons de navigation */}
                        <DoubleButton />

                        {/*Carte du formulaire */}
                        <Card.Root className="login-card">
                            <Card.Header pb={4}>
                                <Card.Description textAlign="center" color="fg.muted">
                                    {t("registration.description")}
                                </Card.Description>
                            </Card.Header>

                            <Card.Body>
                                {/* Affichage des erreurs */}
                                {localError && (
                                    <Alert.Root status="error" color={"red"} mb={tokens.spacing.md}>
                                        <Alert.Indicator />
                                        {localError}
                                    </Alert.Root>
                                )}

                                <Stack gap="4">
                                    {/* Prénom et Nom sur la même ligne */}
                                    <Flex gap={4} direction={{ base: "column", md: "row" }}>
                                        <Field.Root flex={1} mb={{ base: 4, md: 0 }}>
                                            <Field.Label >
                                                {t("field.firstName")} *
                                            </Field.Label>
                                            <Input
                                                name="firstName"
                                                placeholder={t("field.firstNamePlaceholder")}
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                                {...inputProps}
                                            />
                                        </Field.Root>
                                        <Field.Root flex={1}>
                                            <Field.Label>
                                                {t("field.lastName")} *
                                            </Field.Label>
                                            <Input
                                                name="lastName"
                                                placeholder={t("field.lastNamePlaceholder")}
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                                {...inputProps}
                                            />
                                        </Field.Root>
                                    </Flex>

                                    {/* Email */}
                                    <Field.Root>
                                        <Field.Label>
                                            {t("field.email")} *
                                        </Field.Label>
                                        <Input
                                            name="email"
                                            type="email"
                                            placeholder={t("field.emailPlaceholder")}
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            {...inputProps}
                                        />
                                    </Field.Root>

                                    {/* Mot de passe */}
                                    <Field.Root>
                                        <Field.Label>
                                            {t("field.password")} *
                                        </Field.Label>
                                        <Input
                                            name="password"
                                            type="password"
                                            placeholder={t("field.passwordPlaceholder")}
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            {...inputProps}
                                        />
                                    </Field.Root>

                                    {/* Confirmation mot de passe */}
                                    <Field.Root>
                                        <Field.Label>
                                            {t("field.passwordConfirmation")} *
                                        </Field.Label>
                                        <Input
                                            name="confirmPassword"
                                            type="password"
                                            placeholder={t("field.passwordConfirmationPlaceholder")}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            {...inputProps}
                                        />
                                    </Field.Root>
                                </Stack>
                            </Card.Body>

                            <Card.Footer justifyContent="center" pt={4}>
                                <Button
                                    type="submit"
                                    colorScheme="blue"
                                    width="full"
                                    size="lg"
                                    loadingText={t("registration.loading")}
                                >
                                    {t("registration.action")}
                                </Button>
                            </Card.Footer>
                        </Card.Root>
                    </form>
                </Box>
            </Flex>
        </Box>
    );
};
