import {
    Button,
    Card,
    Field,
    Input,
    Stack,
    Heading,
    Fieldset,
    Text,
    Box,
    Flex,
} from "@chakra-ui/react";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useForgotPasswordController } from "../hooks/useForgotPasswordController.ts";
import { tokens } from "../../../../theme/theme.ts";
import {useTranslation} from "react-i18next";

export const ForgotPasswordForm = () => {
    const { t } = useTranslation("forgotPassword");
    const { form, onSubmit, isSuccess, isLoading } = useForgotPasswordController();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
    } = form;

    /**
     * isSubmitted est true uniquement si la soumission du formulaire a réussi et que la requête de
     * mot de passe oublié a été traitée avec succès. Cela garantit que le message de confirmation ne
     * s'affiche que lorsque les deux conditions sont remplies.
     */
    const isSubmitted = isSubmitSuccessful && isSuccess;

    if (isSubmitted) {
        return (
            <Card.Root
                borderColor="border.default"
                borderWidth="1px"
                borderRadius="md"
                width="60%"
                mx="auto"
                mt={5}
                mb={5}
            >
                <Card.Body>
                    <Flex justify="center" mb={4}>
                        <Box bg="green.50" p={4} borderRadius="full">
                            <CheckCircle size={48} color="#38A169" />
                        </Box>
                    </Flex>
                    <Heading as="h1" fontSize="3xl" textAlign="center" mb={tokens.spacing.md}>
                        {t("forgotPassword.emailSentConfirmation")}
                    </Heading>
                    <Text color="gray.600" mb={6} textAlign="center">
                        {t("forgotPassword.checkEmailInstructions")}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mb={6} textAlign="center">
                        {t("forgotPassword.checkSpamFolder")}
                    </Text>
                    <Button
                        variant="ghost"
                        colorScheme="gray"
                        size="sm"
                        mt={4}
                        justifyContent="center"
                        width="60%"
                    >
                        <Link to={"/login"} >
                            <ArrowLeft size={16} />
                            <a href={"/login"}>{t("forgotPassword.backToLogin")}</a>
                        </Link>
                    </Button>
                </Card.Body>
            </Card.Root>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root>
                <Card.Root
                    borderColor="border.default"
                    borderWidth="1px"
                    borderRadius="md"
                    width="100%"
                >
                    <Card.Body>
                        <Flex justify="center" mb={4}>
                            <Box bg="blue.50" p={3} borderRadius="full">
                                <Mail size={32} color="gray" />
                            </Box>
                        </Flex>
                        <Heading as="h1" fontSize="3xl" textAlign="center" mb={tokens.spacing.md}>
                            {t("forgotPassword.title")}
                        </Heading>
                        <Text color="gray.600" fontSize="md" textAlign="center" mb={6}>
                            {t("forgotPassword.description")}
                        </Text>

                        <Stack gap={tokens.spacing.md}>
                            <Field.Root invalid={!!errors.email}>
                                <Field.Label fontWeight="medium" color="gray.700">
                                    {t("forgotPassword.fieldEmail")}
                                </Field.Label>
                                <Input
                                    {...register("email")}
                                    type="email"
                                    placeholder={t("forgotPassword.fieldEmailPlaceholder")}
                                    borderColor={errors.email ? "red.500" : "gray.300"}
                                />
                                {errors.email && (
                                    <Field.ErrorText color="red.500" fontWeight="bold">
                                        {errors.email.message}
                                    </Field.ErrorText>
                                )}
                            </Field.Root>
                        </Stack>

                        <Button
                            type="submit"
                            colorScheme="blue"
                            size="lg"
                            width="50%"
                            mt={tokens.spacing.md}
                            loading={isLoading}
                            loadingText={t("forgotPassword.sending")}
                            mx="auto"
                        >
                            {t("forgotPassword.action")}
                        </Button>

                        <Button
                            variant="ghost"
                            colorScheme="gray"
                            size="sm"
                            mt={4}
                            justifyContent="center"
                            width="50%"
                            mx="auto"
                        >
                            <Link to={"/login"} style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "8px" }}>
                                <ArrowLeft size={16} />
                                {t("forgotPassword.backToLogin")}
                            </Link>
                        </Button>
                    </Card.Body>
                </Card.Root>
            </Fieldset.Root>
        </form>
    );
};