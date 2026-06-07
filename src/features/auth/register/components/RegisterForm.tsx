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
import { tokens } from "../../../../theme/theme.ts";
import { DoubleButton } from "../../../../components/ui/DoubleButton.tsx";
import { useTranslation } from "react-i18next";
import { useRegisterColler } from "../hooks/useRegisterColler.ts"; // ajustez le chemin

export const RegisterForm = () => {
    const { t } = useTranslation("auth");
    const { onSubmit, localError, form } = useRegisterColler();
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
                                    <Alert.Indicator color="red.500"/>
                                    <Alert.Title color="red.500" fontWeight="bold">{localError}</Alert.Title>
                                </Alert.Root>
                            )}

                            <Stack gap="4">
                                <Flex gap={4} direction={{ base: "column", md: "row" }}>
                                    <Field.Root invalid={!!errors.firstName} flex={1} mb={{ base: 4, md: 0 }}>
                                        <Field.Label>{t("field.firstName")} *</Field.Label>
                                        <Input
                                            type="text"
                                            autoComplete="first-name"
                                            placeholder={t("field.firstNamePlaceholder")}
                                            {...register("firstName")}
                                            borderColor={errors.firstName ? "red.500" : "gray.300"}
                                        />
                                        {errors.firstName && (
                                            <Field.ErrorText color="red.500" fontWeight="bold">{errors.firstName.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>

                                    <Field.Root invalid={!!errors.lastName} flex={1}>
                                        <Field.Label>{t("field.lastName")} *</Field.Label>
                                        <Input
                                            type="text"
                                            autoComplete="last-name"
                                            placeholder={t("field.lastNamePlaceholder")}
                                            {...register("lastName")}
                                            borderColor={errors.lastName ? "red.500" : "gray.300"}
                                        />
                                        {errors.lastName && (
                                            <Field.ErrorText color="red.500" fontWeight="bold">{errors.lastName.message}</Field.ErrorText>
                                        )}
                                    </Field.Root>
                                </Flex>

                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label>{t("field.email")} *</Field.Label>
                                    <Input
                                        type="email"
                                        autoComplete="email"
                                        placeholder={t("field.emailPlaceholder")}
                                        {...register("email")}
                                        borderColor={errors.email ? "red.500" : "gray.300"}
                                    />
                                    {errors.email && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">{errors.email.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label>{t("field.password")} *</Field.Label>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder={t("field.passwordPlaceholder")}
                                        {...register("password")}
                                        borderColor={errors.password ? "red.500" : "gray.300"}
                                    />
                                    {errors.password && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">{errors.password.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.confirmPassword}>
                                    <Field.Label>{t("field.passwordConfirmation")} *</Field.Label>
                                    <Input
                                        type="password"
                                        autoComplete="current-password"
                                        placeholder={t("field.passwordConfirmationPlaceholder")}
                                        {...register("confirmPassword")}
                                        borderColor={errors.confirmPassword ? "red.500" : "gray.300"}
                                    />
                                    {errors.confirmPassword && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">{errors.confirmPassword.message}</Field.ErrorText>
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