
import { useUpdatePasswordMutation } from "../../../features/auth/authApi.ts";
import {Button, Input, VStack, Text, Flex, Box, Alert} from "@chakra-ui/react";
import React, {type FormEvent, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Lock} from "lucide-react";
import {tokens} from "../../ui/theme.ts";
import {useTranslation} from "react-i18next";

export const UpdatePassword = () => {
    const [error, setError] = useState('');
    const [updatePassword] = useUpdatePasswordMutation();
    const navigate = useNavigate();
    const {t} = useTranslation("auth");
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('')
        if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
            setError(t("validation.requiredFields"));
            return;
        }

        if (formData.newPassword.length < 6) {
            setError(t("resetPassword.passwordLength"));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError(t("resetPassword.passwordsMustMatch"));
            return;
        }
        try{
            await updatePassword({ currentPassword: formData.currentPassword, newPassword: formData.newPassword }).unwrap();
            navigate("/collection");
        }catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 404 || status === 401 || status === 500) {
                setError("Une erreur est survenue. Veuillez réessayer plus tard.");
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    return (
        <Box
            maxW="450px"
            mx="auto"
            mt={20}
            p={8}
            bg="white"
            borderRadius="xl"
            boxShadow="xl"
            textAlign="center"
            mb={50}
        >
            <Flex justify="center" mb={4}>
                <Box
                    bg="green.50"
                    p={4}
                    borderRadius="full"
                >
                    <Lock size={48} color="#38A169" />
                </Box>
            </Flex>
                <VStack
                    gap={tokens.spacing.md}
                    w="full"
                >
                    <Text>{t("updatePassword.title")}</Text>

                    {error &&
                        <Alert.Root status="error" color={"red"} mb={tokens.spacing.md}>
                            <Alert.Indicator />
                            <Alert.Title>{error}</Alert.Title>
                        </Alert.Root>
                    }

                    <form method="POST" onSubmit={handleSubmit}>
                        <Input
                            type="password"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder={t("updatePassword.currentPasswordPlaceholder")}
                            name="currentPassword"
                            mb="4"
                        />
                        <Input
                            type="password"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder={t("updatePassword.newPasswordPlaceholder")}
                            name="newPassword"
                            mb="4"
                        />
                        <Input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder={t("updatePassword.confirmPasswordPlaceholder")}
                            name="confirmPassword"
                            mb="4"
                        />
                        <Button
                            onClick={handleSubmit}
                            type="submit" variant="solid"
                            w="full"
                        >
                            {t("updatePassword.action")}
                        </Button>
                    </form>
                </VStack>
        </Box>
    );
};
