import {
    Button,
    Alert,
    Fieldset,
    Field,
    Input,
    Stack,
    Heading,
    Card,
    Flex,
    Box,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { tokens } from "../../../../theme/theme.ts";
import { useUpdatePasswordController } from "../hooks/useUpdatePasswordController.ts";
import { Lock } from "lucide-react";

export const UpdatePasswordForm = () => {
    const { t } = useTranslation("auth");
    const { form, onSubmit, isLoading } = useUpdatePasswordController();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Fieldset.Root
                invalid={
                    !!errors.currentPassword ||
                    !!errors.newPassword ||
                    !!errors.confirmPassword
                }
            >
                <Card.Root
                    width="100%"
                    mx="auto"
                    border="none"
                >
                    <Card.Body>
                        <Flex justify="center" mb={4}>
                            <Box bg="green.50" p={4} borderRadius="full">
                                <Lock size={48} color="#38A169" />
                            </Box>
                        </Flex>
                        <Heading
                            as="h1"
                            fontSize="3xl"
                            textAlign="center"
                            mb={tokens.spacing.md}
                        >
                            {t("updatePassword.title")}
                        </Heading>

                        {errors.root && (
                            <Alert.Root status="error" mb={tokens.spacing.md}>
                                <Alert.Indicator color="red.500" fontWeight="bold" />
                                <Alert.Title color="red.500" fontWeight="bold">
                                    {errors.root.message}
                                </Alert.Title>
                            </Alert.Root>
                        )}

                        <Stack gap={tokens.spacing.md}>
                            <Field.Root invalid={!!errors.currentPassword}>
                                <Field.Label>
                                    {t("updatePassword.currentPasswordPlaceholder")}
                                </Field.Label>
                                <Input
                                    type="password"
                                    placeholder={t("updatePassword.currentPasswordPlaceholder")}
                                    {...register("currentPassword")}
                                    borderColor={errors.confirmPassword ? "red.500" : "gray.300"}
                                />
                                {errors.currentPassword && (
                                    <Field.ErrorText color="red.500" fontWeight="bold">
                                        {errors.currentPassword.message}
                                    </Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.newPassword}>
                                <Field.Label>
                                    {t("updatePassword.newPasswordPlaceholder")}
                                </Field.Label>
                                <Input
                                    type="password"
                                    placeholder={t("updatePassword.newPasswordPlaceholder")}
                                    {...register("newPassword")}
                                    borderColor={errors.confirmPassword ? "red.500" : "gray.300"}
                                />
                                {errors.newPassword && (
                                    <Field.ErrorText color="red.500" fontWeight="bold">
                                        {errors.newPassword.message}
                                    </Field.ErrorText>
                                )}
                            </Field.Root>

                            <Field.Root invalid={!!errors.confirmPassword}>
                                <Field.Label>
                                    {t("updatePassword.confirmPasswordPlaceholder")}
                                </Field.Label>
                                <Input
                                    type="password"
                                    placeholder={t("updatePassword.confirmPasswordPlaceholder")}
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

                        <Button
                            type="submit"
                            variant="solid"
                            w="50%"
                            mt={tokens.spacing.md}
                            loading={isLoading}
                            mx="auto"
                        >
                            {t("updatePassword.action")}
                        </Button>
                    </Card.Body>
                </Card.Root>
            </Fieldset.Root>
        </form>
    );
};