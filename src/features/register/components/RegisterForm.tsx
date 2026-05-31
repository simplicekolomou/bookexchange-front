import {
    Button,
    Card,
    Field,
    Input,
    Stack,
    Flex,
    Heading,
    Alert,
    Fieldset,
} from "@chakra-ui/react";
import { tokens } from "../../../components/ui/theme";
import { DoubleButton } from "../../../components/layout/DoubleButton";
import { useTranslation } from "react-i18next";
import { useRegisterColler } from "../hooks/useRegisterColler"; // ajustez le chemin

export const RegisterForm = () => {
    const { t } = useTranslation("auth");
    const { onSubmit, localError, form, inputProps } = useRegisterColler();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root>
                <Heading as="h1" fontSize="3xl" mb={tokens.spacing.xl}>
                    {t("registration.title")}
                </Heading>


                <DoubleButton />

                <Fieldset.Content>
                    <Card.Root
                        borderColor="border.default"
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        <Card.Header pb={4}>
                            <Card.Description textAlign="center" color="fg.muted">
                                {t("registration.description")}
                            </Card.Description>
                        </Card.Header>

                        <Card.Body>
                            {localError && (
                                <Alert.Root status="error" mb={tokens.spacing.md}>
                                    <Alert.Indicator />
                                    <Alert.Title>{localError}</Alert.Title>
                                </Alert.Root>
                            )}

                            <Stack gap="4">
                                <Flex gap={4} direction={{ base: "column", md: "row" }}>
                                    <Field.Root invalid={!!errors.firstName} flex={1} mb={{ base: 4, md: 0 }}>
                                        <Field.Label>{t("field.firstName")} *</Field.Label>
                                        <Input
                                            type="text"
                                            placeholder={t("field.firstNamePlaceholder")}
                                            {...register("firstName")}
                                            {...inputProps}
                                        />
                                        {errors.firstName && (
                                            <Field.ErrorText>{errors.firstName.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.lastName} flex={1}>
                                        <Field.Label>{t("field.lastName")} *</Field.Label>
                                        <Input
                                            type="text"
                                            placeholder={t("field.lastNamePlaceholder")}
                                            {...register("lastName")}
                                            {...inputProps}
                                        />
                                        {errors.lastName && (
                                            <Field.ErrorText>{errors.lastName.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>
                                </Flex>

                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label>{t("field.email")} *</Field.Label>
                                    <Input
                                        type="email"
                                        placeholder={t("field.emailPlaceholder")}
                                        {...register("email")}
                                        {...inputProps}
                                    />
                                    {errors.email && (
                                        <Field.ErrorText>{errors.email.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label>{t("field.password")} *</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder={t("field.passwordPlaceholder")}
                                        {...register("password")}
                                        {...inputProps}
                                    />
                                    {errors.password && (
                                        <Field.ErrorText>{errors.password.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.confirmPassword}>
                                    <Field.Label>{t("field.passwordConfirmation")} *</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder={t("field.passwordConfirmationPlaceholder")}
                                        {...register("confirmPassword")}
                                        {...inputProps}
                                    />
                                    {errors.confirmPassword && (
                                        <Field.ErrorText>{errors.confirmPassword.message}</Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                        </Card.Body>

                        <Card.Footer justifyContent="center" pt={4}>
                            <Button
                                type="submit"
                                variant="solid"
                                width="full"
                                size="lg"
                                loading={isSubmitting}
                                loadingText={t("registration.loading")}
                            >
                                {t("registration.action")}
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        </form>
    );
};