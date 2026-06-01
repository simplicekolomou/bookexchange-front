import {
    Button,
    Card,
    Field,
    Input,
    Stack,
    Heading,
    Alert,
    Fieldset,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme/theme.ts";
import { DoubleButton } from "../../../components/ui/DoubleButton.tsx";
import { useLoginController } from "../hooks/useLoginController";
import { useTranslation } from "react-i18next";

export default function LoginForm() {
    const { t } = useTranslation("auth");
    const { onSubmit, localError, form } = useLoginController();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root>
                <Heading as="h1" fontSize="3xl" mb={tokens.spacing.xl}>
                    {t("login.title")}
                </Heading>

                <DoubleButton />

                <Fieldset.Content>
                    <Card.Root
                        borderColor="border.default"
                        borderWidth="1px"
                        borderRadius="md"
                    >
                        <Card.Header>
                            <Card.Description textAlign="center">
                                {t("login.description")}
                            </Card.Description>
                        </Card.Header>

                        <Card.Body>
                            {localError && (
                                <Alert.Root status="error" mb={tokens.spacing.md}>
                                    <Alert.Indicator color="red.500" fontWeight="bold"/>
                                    <Alert.Title color="red.500" fontWeight="bold">{localError}</Alert.Title>
                                </Alert.Root>
                            )}

                            <Stack gap={tokens.spacing.md}>
                                <Field.Root invalid={!!errors.email}>
                                    <Field.Label >{t("field.email")}</Field.Label>
                                    <Field.RequiredIndicator />
                                    <Input
                                        type="email"
                                        autoComplete="email"
                                        aria-label="Email"
                                        {...register("email")}
                                        bg="transparent"
                                        borderColor={errors.email ? "red.500" : "gray.200"}
                                    />
                                    {errors.email && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">{errors.email.message}</Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label>{t("field.password")}</Field.Label>
                                    <Input
                                        aria-label="Password"
                                        autoComplete="current-password"
                                        type="password"
                                        {...register("password")}
                                        bg="transparent"
                                        borderColor={errors.password ? "red.500" : "gray.200"}
                                    />
                                    {errors.password && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">{errors.password.message}</Field.ErrorText>
                                    )}
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
                                w="full"
                                loading={isSubmitting}
                            >
                                {t("login.action")}
                            </Button>
                            <Link to="/forgot-password" className="mt-4 text-center">
                                {t("login.passwordReset")}
                            </Link>
                        </Card.Footer>
                    </Card.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        </form>
    );
}