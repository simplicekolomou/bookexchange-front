import {Box, Button, Container, FileUpload, Flex, Grid, Heading, Input, Switch, Text, Textarea, VStack} from "@chakra-ui/react";
import {useTranslation} from "react-i18next";
import {HiCheck, HiX} from "react-icons/hi";
import * as React from "react";
import {useEffect, useState} from "react";
import {useUpdateProfilePictureMutation, useUpdateUserProfileMutation} from "../../../features/profile/profileApi.ts";
import {useNavigate} from "react-router-dom";
import {profileUpdated} from "../../../features/profile/profileSlice.ts";
import {useAppDispatch} from "../../../app/hooks.ts";
import type {UpdateProfileData} from "../../../types/profile.types.ts";
import {LuFileImage} from "react-icons/lu";
import {FileUploader} from "./FileUploader.tsx";

export const Settings = () => {
    const { t } = useTranslation(['profile', 'common']);
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');
    const [update, {isSuccess: isUpdateSuccess}] = useUpdateUserProfileMutation();
    const [updatePicture] = useUpdateProfilePictureMutation();
    const dispatch = useAppDispatch();
    const user = JSON.parse(localStorage.getItem("auth_user")!);
    const [isVisible, setIsVisible] = useState(!user?.visible);

    const [formData, setFormData] = useState<UpdateProfileData>({
        firstName:  user.firstName || '',
        lastName:  user.lastName || '',
        bio: user.bio || '',
        isVisible: !isVisible,
        profilePicture: user.profilePicture || '',
        address: {
            locality: user.adress?.locality || '',
            street: user.adress?.street || '',
            country: user.adress?.country || '',
            zipCode: user.adress?.zipCode || '',
            postalBoxNumber: user.adress?.postalBoxNumber || ''
        }
    });
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
    const [profilePicture, setProfilePicture] = useState(formData.profilePicture);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        const updateInfo = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            bio: formData.bio,
            visible: !isVisible,
            profilePicture: profilePicture,
            adress: {
                locality: formData.address?.locality,
                street: formData.address?.street,
                zipCode: formData.address?.zipCode,
                country: formData.address?.country,
                postalBoxNumber: formData.address?.postalBoxNumber
            }
        }

        try {
            if (profilePictureFile) {
                await updatePicture(profilePictureFile).unwrap();
            }
            await update(updateInfo).unwrap();
            // construire un objet utilisateur mis à jour localement (puisqu'API ne renvoie rien)
            const updatedUser = {
                ...user,
                firstName: updateInfo.firstName,
                lastName: updateInfo.lastName,
                bio: updateInfo.bio,
                visible: updateInfo.visible,
                adress: {
                    ...(user.address || {}),
                    locality: formData.address?.locality,
                    street: formData.address?.street,
                    zipCode: formData.address?.zipCode,
                    country: formData.address?.country,
                    postalBoxNumber: formData.address?.postalBoxNumber
                }
            }
            // mettre à jour le localStorage et le state Redux
            localStorage.setItem("auth_user", JSON.stringify(updatedUser));
            dispatch(profileUpdated({ profile: updatedUser }));

        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 400 || status === 401) {
                setLocalError(t("profile:invalidInformation"));
            } else {
                setLocalError(t("profile:serverError"));
            }
        }
    };

    useEffect(() => {
        if(isUpdateSuccess){
            setLocalError('')
            navigate('/collection')
        }
    }, [isUpdateSuccess, navigate]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement;
        if (name === 'bio') {
            setFormData({ ...formData, bio: value });
            return;
        }
        if (name === 'zipCode' || name === 'postalBoxNumber') {
            const toNumber = convertToNumber(value);
            setFormData({
                ...formData,
                address: {
                    ...formData.address,
                    [name]: toNumber
                }
            });
            return;
        }
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [e.target.name]: value
            }
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocalError('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePrivacyToggle = (value: boolean | { checked?: boolean }) => {
        const val = typeof value === 'boolean' ? value : Boolean((value.checked));
        setIsVisible(val);
    };
    const convertToNumber = (input: string)=> {
        if (input === '') return '';
        return input.replace(/\D+/g, '');
    }

    const handleFileChange = (files: File[] | null) => {
        if (files && files.length > 0) {
            const file = files[0];
            setProfilePictureFile(file);
            setProfilePicture(URL.createObjectURL(file));
        }
    };

    return (
        <Box className="add-book-container">
            <Container maxW="4xl" py={8}>
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    {t("profile:title")}
                </Heading>

                {/* Formulaire */}
                <Box bg="white" borderRadius="lg" p={{ base: 4, md: 6 }} boxShadow="sm" border="1px" borderColor="gray.100" >
                    <form onSubmit={handleSubmit} method={"POST"}>
                        {/* Informations du profil */}
                        <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                            {t("profile:subtitle")}
                        </Text>

                        {/* Affichage des erreurs locales */}
                        {localError && (
                            <Box mb={4} p={3} bg="red.50" borderRadius="md" border="1px" borderColor="red.200">
                                <Text color="red.700" fontSize="sm">
                                    {localError}
                                </Text>
                            </Box>
                        )}

                        <VStack gap={6} align="stretch">
                            {/* Nom et Prénom */}
                            <Box>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:firstName")}
                                        </Text>
                                        <Input
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            placeholder={t("profile:firstNamePlaceholder")} required size="md" />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:lastName")}
                                        </Text>
                                        <Input
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            placeholder={t("profile:lastNamePlaceholder")}
                                            required size="md" />
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Adresse */}

                            <Box>
                                <Text fontWeight="medium" fontSize="lg" textAlign="center">
                                    {t("profile:addressTitle")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:locality")}
                                        </Text>

                                        <Input
                                            value={formData.address?.locality}
                                            onChange={handleAddressChange}
                                            placeholder={t("profile:localityPlaceholder")}
                                            size="md"
                                            name="locality"
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:postalCode")}
                                        </Text>
                                        <Input
                                            value={formData.address?.zipCode}
                                            onChange={handleAddressChange}
                                            placeholder={t("profile:postalCodePlaceholder")}
                                            size="md"
                                            name="zipCode"
                                            type="number"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:street")}
                                        </Text>
                                        <Input
                                            value={formData.address?.street}
                                            onChange={handleAddressChange}
                                            placeholder={t("profile:streetPlaceholder")}
                                            size="md"
                                            name="street"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:postalBoxNumber")}
                                        </Text>

                                        <Input
                                            value={formData.address?.postalBoxNumber}
                                            onChange={handleAddressChange}
                                            placeholder={t("profile:postalBoxNumberPlaceholder")}
                                            size="md"
                                            type="number"
                                            name="postalBoxNumber"
                                        />
                                    </Box>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:country")}
                                        </Text>
                                        <Input
                                            value={formData.address?.country}
                                            onChange={handleAddressChange}
                                            placeholder={t("profile:countryPlaceholder")}
                                            size="md"
                                            name="country"
                                        />
                                    </Box>
                                </Grid>
                            </Box>

                            <Box gap={4} mt={4}>
                                <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                    {t("profile:bio")}
                                </Text>
                                <Textarea
                                    value={formData.bio}
                                    onChange={handleAddressChange}
                                    placeholder={t("profile:bioPlaceholder")}
                                    size="md"
                                    name="bio"
                                />
                            </Box>

                            {/* Téléchargement de la photo de profil */}

                            <Box
                                w="40%"
                                h="40%"
                            >
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

                            {/* Etat du profil */}
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
                                        onCheckedChange={handlePrivacyToggle}
                                    >
                                        <Switch.HiddenInput />

                                        <Switch.Control
                                            bg="bg.surface"
                                            borderWidth="1px"
                                            borderRadius="sm"
                                            alignItems="center"
                                            _checked={{
                                                bg: 'colorPalette.default',
                                                borderColor: 'colorPalette.default',
                                            }}
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

                            {/* Boutons d'action */}
                            <Flex gap={3} justifyContent="flex-end" flexDirection={{ base: "column", sm: "row" }} pt={4}
                                  borderTop="1px" borderColor="gray.200" >
                                <Button variant="outline" type={"submit"} size="lg" flex={{ base: 1, sm: "none" }} >
                                    {t("profile:actions.save")}
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    size="lg"
                                    onClick={()=> navigate("/profile")}
                                    flex={{ base: 1, sm: "none" }}
                                >
                                    {t("profile:actions.profile")}
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                </Box>
            </Container>
        </Box>
    )
}