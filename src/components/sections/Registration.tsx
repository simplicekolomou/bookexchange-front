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
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import * as React from "react";
import { useRegisterMutation } from "../../features/auth/authApi";
import { useAppDispatch } from "../../app/hooks";
import { setCredentials } from "../../features/auth/authSlice";

export const Registration = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const [localError, setLocalError] = useState('');
    const [activeButton, setActiveButton] = useState("register");
    const [register, { isLoading, error: apiError }] = useRegisterMutation();

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

        // Validation côté client améliorée
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

            // Dispatch des credentials dans le store Redux
            dispatch(setCredentials({
                user: result.user,
                token: result.token
            }));

            /*
            // Notification de succès
            toaster.create({
                title: t("registration.success"),
                description: t("registration.welcome") || `Bienvenue ${result.user.firstName} !`,
                duration: 3000,
                closable: true,
            });*/

            // Redirection vers la collection
            navigate("/collection", { replace: true });

        } catch (err: unknown) {
            // Gestion d'erreur pour RTK Query
            const e = err as { message?: string; error?: string } | undefined;

            const errorMessage =
                e?.message ??
                e?.error ??
                t("registration.error");

            setLocalError(errorMessage);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Déterminer le message d'erreur à afficher
    const displayError = localError ||
        (apiError && ('data' in apiError
                ? (apiError.data as Error)?.message
                : t("registration.error")
        ));

    return (
        <Box minH="100vh" bg="gray.50" py={5}>
            <Flex
                justify="center"
                align="center"
                className="login-registration-box"
            >
                <Box w={{ base: "100%", md: "70%" }}>
                    <form onSubmit={handleSubmit} method="POST">
                        <Heading
                            as="h1"
                            fontSize="3xl"
                            mb="6"
                            textAlign="center"
                        >
                            {t("registration.title")}
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

                        {/*Carte du formulaire */}
                        <Card.Root className="form" variant="outline">
                            <Card.Header pb={4}>
                                <Card.Description textAlign="center">
                                    {t("registration.description")}
                                </Card.Description>
                            </Card.Header>

                            <Card.Body className="form-field">
                                {/* Affichage des erreurs */}
                                {displayError && (
                                    <Alert.Root status="error" mb={4} borderRadius="md">
                                        {displayError}
                                    </Alert.Root>
                                )}

                                <Stack gap="4">
                                    {/* Prénom et Nom sur la même ligne */}
                                    <Flex gap={4} className="firstName-name-disposition" direction={{ base: "column", md: "row" }}>
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
                                                className="form-input"
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
                                                className="form-input"
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
                                            className="form-input"
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
                                            className="form-input"
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
                                            className="form-input"
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
                                    disabled={isLoading}
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