import {
    Button,
    Card,
    Fieldset,
    Stack,
    Grid,
    Input,
    Textarea,
    Text,
    Flex,
    Box,
    FileUpload,
    Switch,
    Alert,
} from "@chakra-ui/react";
import { HiCheck, HiX } from "react-icons/hi";
import { LuFileImage } from "react-icons/lu";
import { FileUploader } from "./FileUploader.tsx";
import {type SettingsFormData, useSettingsController} from "../hooks/useSettingsController.ts";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../../../theme/theme.ts";
import { type Path } from "react-hook-form";

export const SettingsForm = () => {
    const navigate = useNavigate();
    const {
        t,
        user,
        form,
        isVisible,
        localError,
        handlePrivacyToggle,
        handleFileChange,
        onSubmit,
    } = useSettingsController();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = form;

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
                        <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                            {t("profile:subtitle")}
                        </Text>

                        {localError && (
                            <Alert.Root status="error" mb={tokens.spacing.md}>
                                <Alert.Indicator color="red.500" fontWeight="bold" />
                                <Alert.Title color="red.500" fontWeight="bold">
                                    {localError}
                                </Alert.Title>
                            </Alert.Root>
                        )}

                        <Stack gap={6} align="stretch">
                            {/* Nom / Prénom */}
                            <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                <Box>
                                    <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                        {t("profile:firstName")}
                                    </Text>
                                    <Input
                                        {...register("firstName")}
                                        placeholder={t("profile:firstNamePlaceholder")}
                                        size="md"
                                        borderColor={errors.firstName ? "red.500" : "gray.300"}
                                    />
                                    {errors.firstName && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {t(errors.firstName.message as string)}
                                        </Text>
                                    )}
                                </Box>
                                <Box>
                                    <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                        {t("profile:lastName")}
                                    </Text>
                                    <Input
                                        {...register("lastName")}
                                        placeholder={t("profile:lastNamePlaceholder")}
                                        size="md"
                                        borderColor={errors.lastName ? "red.500" : "gray.300"}
                                    />
                                    {errors.lastName && (
                                        <Text color="red.500" fontSize="sm" mt={1}>
                                            {t(errors.lastName.message as string)}
                                        </Text>
                                    )}
                                </Box>
                            </Grid>

                            {/* Adresse */}
                            <Box>
                                <Text fontWeight="medium" fontSize="lg" textAlign="center" mb={2}>
                                    {t("profile:addressTitle")}
                                </Text>

                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    {[
                                        { label: "locality", name: "adress.locality" as Path<SettingsFormData>, type: "text" },
                                        { label: "postalCode", name: "adress.zipCode" as Path<SettingsFormData>, type: "text" },
                                        { label: "street", name: "adress.street" as Path<SettingsFormData>, type: "text" },
                                        { label: "postalBoxNumber", name: "adress.postalBoxNumber" as Path<SettingsFormData>, type: "text" },
                                        { label: "country", name: "adress.country" as Path<SettingsFormData>, type: "text" },
                                    ].map(({ label, name, type }) => (
                                        <Box key={name}>
                                            <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                                {t(`profile:${label}`)}
                                            </Text>
                                            <Input
                                                type={type}
                                                {...register(name)} // plus besoin de "as any"
                                                placeholder={t(`profile:${label}Placeholder`)}
                                                size="md"
                                                borderColor={"gray.300"}
                                            />
                                        </Box>
                                    ))}
                                </Grid>
                            </Box>

                            {/* Bio */}
                            <Box>
                                <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                    {t("profile:bio")}
                                </Text>
                                <Textarea
                                    {...register("bio")}
                                    placeholder={t("profile:bioPlaceholder")}
                                    size="md"
                                    borderColor={errors.bio ? "red.500" : "gray.300"}
                                />
                            </Box>

                            {/* Photo de profil */}
                            <Box w="40%" h="40%">
                                <FileUpload.Root
                                    accept="image/*"
                                    maxFiles={1}
                                    onFileChange={(details) => handleFileChange(details.acceptedFiles)}
                                >
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm">
                                            <LuFileImage /> {t("profile:uploadProfilePicture")}
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUploader />
                                </FileUpload.Root>
                            </Box>

                            {/* Visibilité */}
                            <Box p={4} bg="bg.canvas" borderRadius="md">
                                <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                                    <Box flex="1">
                                        <Text fontWeight="medium" mb={1} fontSize="sm" color="gray.800" textAlign="left">
                                            {t("profile:profileState.title")}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600" textAlign="left">
                                            {t("profile:profileState.subtitle")}
                                        </Text>
                                    </Box>
                                    <Switch.Root
                                        size="lg"
                                        checked={isVisible}
                                        onCheckedChange={(details: unknown) =>
                                            typeof details === "boolean"
                                                ? handlePrivacyToggle(details)
                                                : handlePrivacyToggle((details as { checked?: boolean }).checked ?? false)
                                        }
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control
                                            bg="bg.surface"
                                            borderWidth="1px"
                                            borderRadius="sm"
                                            alignItems="center"
                                            _checked={{
                                                bg: "colorPalette.default",
                                                borderColor: "colorPalette.default",
                                            }}
                                            borderColor={isVisible ? "colorPalette.default" : "gray.300"}
                                        >
                                            <Switch.Thumb
                                                boxSize={{ base: 4, md: 6 }}
                                                bg="white"
                                                borderRadius="sm"
                                                justifyContent="center"
                                            >
                                                {isVisible ? <HiCheck color="orange" /> : <HiX color="red" />}
                                            </Switch.Thumb>
                                        </Switch.Control>
                                    </Switch.Root>
                                </Flex>
                            </Box>

                            {/* Actions */}
                            <Flex
                                gap={3}
                                justifyContent="flex-end"
                                flexDirection={{ base: "column", sm: "row" }}
                                pt={4}
                                borderTop="1px"
                                borderColor="gray.200"
                            >
                                <Button variant="outline" type="submit" size="lg" flex={{ base: 1, sm: "none" }}>
                                    {t("profile:actions.save")}
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    flex={{ base: 1, sm: "none" }}
                                    onClick={() => user?.id && navigate(`/user/${user.id}/profile`)}
                                >
                                    {t("profile:actions.profile")}
                                </Button>
                            </Flex>
                        </Stack>
                    </Card.Body>
                </Card.Root>
            </Fieldset.Root>
        </form>
    );
};