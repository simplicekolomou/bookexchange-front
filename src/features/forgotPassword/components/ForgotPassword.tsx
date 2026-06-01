import React, {type FormEvent, useEffect, useState} from 'react';
import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Heading,
    Alert,
    Flex
} from '@chakra-ui/react';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import {Link} from "react-router-dom";
import {useForgotPasswordMutation} from "../../auth/api/authApi.ts";
import {useTranslation} from "react-i18next";
import {tokens} from "../../../theme/theme.ts";

export const ForgotPassword = ()=> {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [forgotPassword, { isSuccess }] = useForgotPasswordMutation();
    const {t} = useTranslation("auth");

    const [formData, setFormData] = useState({
        email: ''
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        if (!formData.email) {
            setError(t("forgotPassword.requiredEmail"));
            return;
        }

        if (!validateEmail(formData.email)) {
            setError(t("forgotPassword.invalidEmail"));
            return;
        }
        try {
            await forgotPassword(formData.email).unwrap();
        }catch (error) {
            const status = (error as { status?: number })?.status;
            setIsSubmitted(false)
            if(status === 404){
                setError(t("forgotPassword.notFoundEmail"));
            }else {
                setError(t("forgotPassword.serverError"));
            }
        }
    };

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };


    const handleBackToLogin = () => {
        setIsSubmitted(false);
        setFormData({ email: '' });
        setError('');
    };

    useEffect(() => {
        if(isSuccess){
            setIsSubmitted(true);
            setError('');
        }
    }, [isSuccess]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    if (isSubmitted) {
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
                        <CheckCircle size={48} color="#38A169" />
                    </Box>
                </Flex>

                <Heading size="lg" mb={4} color="gray.800">
                    {t("forgotPassword.emailSentConfirmation")}
                </Heading>

                <Text color="gray.600" mb={6}>
                    {t("forgotPassword.checkEmailInstructions")}
                </Text>

                <Text fontSize="sm" color="gray.500" mb={6}>
                    {t("forgotPassword.checkSpamFolder")}
                </Text>

                <Button
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    onClick={handleBackToLogin}
                >
                    {t("forgotPassword.backToLogin")}
                </Button>
            </Box>
        );
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
            mb={50}
        >
            <VStack gap={6} align="stretch">
                <Box textAlign="center">
                    <Flex justify="center" mb={4}>
                        <Box
                            bg="blue.50"
                            p={3}
                            borderRadius="full"
                        >
                            <Mail size={32} color="gray" />
                        </Box>
                    </Flex>

                    <Heading size="xl" mb={2} color="gray.800">
                        {t("forgotPassword.title")}
                    </Heading>

                    <Text color="gray.600" fontSize="md">
                        {t("forgotPassword.description")}
                    </Text>
                </Box>

                {error && (
                    <Alert.Root status="error" color={"red"} mb={tokens.spacing.md}>
                        <Alert.Indicator />
                        <Alert.Title>{error}</Alert.Title>
                    </Alert.Root>
                )}

                <Box>
                    <Text mb={2} fontWeight="medium" color="gray.700">
                        {t("forgotPassword.fieldEmail")}
                    </Text>
                    <Input
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={t("forgotPassword.fieldEmailPlaceholder")}
                        size="lg"
                        name="email"
                    />
                </Box>

                <Button
                    onClick={handleSubmit}
                    colorScheme="blue"
                    size="lg"
                    width="full"
                    loadingText="Envoi en cours..."
                >
                    {t("forgotPassword.action")}
                </Button>

                <Flex justify="center" align="center" gap={1}>
                    <ArrowLeft size={16} color="#718096" />
                    <Link
                        to="/LoginForm"
                    >
                        {t("forgotPassword.backToLogin")}
                    </Link>
                </Flex>
            </VStack>
        </Box>
    );
}