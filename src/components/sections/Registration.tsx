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
import { useRegisterMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";
import {tokens} from "../ui/theme.ts";
import type {UserProfile} from "../../types/profile.types.ts";

export const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [localError, setLocalError] = useState('');
    const [activeButton, setActiveButton] = useState("register");
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

    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation côté client
        if (!formData.email || !formData.firstName || !formData.lastName || !formData.password) {
            setLocalError(t("validation.allFieldsRequired") || "Tous les champs sont obligatoires");
            return;
        }

        if (formData.password.length < 6) {
            setLocalError(t("validation.passwordLength") || "Le mot de passe doit contenir au moins 6 caractères");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setLocalError(t("validation.passwordMismatch") || "Les mots de passe ne correspondent pas");
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
            const err = (error as { data?: { error?: string } })?.data?.error;
            if(err === "Bad Request"){
                setLocalError("Cet email est déjà utilisé.");
                return;
            }else {
                setLocalError("Une erreur est survenue lors de l'inscription. Veuillez réessayer plus tard.");
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
            const user: UserProfile = JSON.parse(localStorage.getItem("auth_user")!);
            navigate(`/user/${user.id}/collection`, {replace: true});
        }
    }, [isRegisterSuccess, navigate]);

    // Props réutilisables pour tous les Input, basés sur les tokens sémantiques du thème
    const inputProps = {
        borderWidth: "2px",
        borderColor: "border.default",
        borderRadius: "md",
        bg: "bg.surface",
        color: "fg.default",
        _placeholder: { color: "fg.muted" },
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
                        <Flex
                            mb={tokens.spacing.md}
                            gap={tokens.spacing.xl}
                            justify="center"
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
                                    <Alert.Root status="error" mb={4} borderRadius="md">
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
