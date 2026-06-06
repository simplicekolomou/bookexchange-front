import {
    Button,
    Card,
    Field,
    Input,
    Stack,
    Heading,
    Alert,
    Fieldset,
    Box,
    Flex,
} from "@chakra-ui/react";
import { CheckCircle } from "lucide-react";
import { tokens } from "../../../theme/theme.ts";
import { useTranslation } from "react-i18next";
import { useResetPasswordController } from "../hooks/useResetPasswordController.ts";

export const ResetPasswordForm = () => {
    const { t } = useTranslation("auth");
    const { register, handleSubmit, errors, isSubmitting, onSubmit } =
        useResetPasswordController();

    const hasErrors = !!errors.password || !!errors.confirmPassword || !!errors.root;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root invalid={hasErrors}>
                <Fieldset.Content>
                    <Card.Root
                        borderColor="border.default"
                        borderWidth="1px"
                        borderRadius="md"
                        width="60%"
                        mx="auto"
                        mt={5}
                        mb={5}
                    >
                        <Card.Header>
                            <Flex justify="center" mb={2}>
                                <Box bg="green.50" p={4} borderRadius="full">
                                    <CheckCircle size={48} color="#38A169" />
                                </Box>
                            </Flex>
                            <Heading as="h1" fontSize="3xl" textAlign="center" mb={tokens.spacing.md}>
                                {t("resetPassword.title")}
                            </Heading>
                        </Card.Header>

                        <Card.Body>
                            {errors.root && (
                                <Alert.Root status="error" mb={tokens.spacing.md}>
                                    <Alert.Indicator color="red.500" fontWeight="bold" />
                                    <Alert.Title color="red.500" fontWeight="bold">
                                        {errors.root.message}
                                    </Alert.Title>
                                </Alert.Root>
                            )}

                            <Stack gap={tokens.spacing.md}>
                                <Field.Root invalid={!!errors.password}>
                                    <Field.Label>{t("resetPassword.newPasswordPlaceholder")}</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder={t("resetPassword.newPasswordPlaceholder")}
                                        {...register("password")}
                                        borderColor={errors.password ? "red.500" : "gray.300"}
                                    />
                                    {errors.password && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">
                                            {errors.password.message}
                                        </Field.ErrorText>
                                    )}
                                </Field.Root>

                                <Field.Root invalid={!!errors.confirmPassword}>
                                    <Field.Label>{t("resetPassword.confirmPasswordPlaceholder")}</Field.Label>
                                    <Input
                                        type="password"
                                        placeholder={t("resetPassword.confirmPasswordPlaceholder")}
                                        {...register("confirmPassword")}
                                        borderColor={errors.confirmPassword ? "red.500" : "gray.300"}
                                    />
                                    {errors.confirmPassword && (
                                        <Field.ErrorText color="red.500" fontWeight="bold">
                                            {errors.confirmPassword.message}
                                        </Field.ErrorText>
                                    )}
                                </Field.Root>
                            </Stack>
                        </Card.Body>

                        <Card.Footer justifyContent="center" pt={tokens.spacing.md}>
                            <Button
                                type="submit"
                                variant="solid"
                                w="full"
                                loading={isSubmitting}
                            >
                                {t("resetPassword.action")}
                            </Button>
                        </Card.Footer>
                    </Card.Root>
                </Fieldset.Content>
            </Fieldset.Root>
        </form>
    );
};