import {
    Box, Button,
    Container,
    FileUpload,
    Flex,
    Grid,
    Heading,
    Input,
    Switch,
    Text,
    VStack
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {useState} from "react";
import {HiUpload} from "react-icons/hi";

export const Settings = () => {
    const { t } = useTranslation(['profile', 'common']);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        locality: '',
        bookState: '',
        bio: '',
        profilePicture: '',
        profileState: false
    });
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Profile mis à jour :", formData);
        // TODO : Ajouter la logique pour envoyer les données au backend
    };

    const handleReset = () => {
        setFormData({
            firstName: '',
            lastName: '',
            locality: '',
            bookState: '',
            bio: '',
            profilePicture: '',
            profileState: false
        });
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
                    <form onSubmit={handleSubmit}>
                        <VStack gap={6} align="stretch">
                            {/* Informations du profil */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("profile:subtitle")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:firstName")}
                                        </Text>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            placeholder={t("profile:firstNamePlaceholder")} required size="md" />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:lastName")}
                                        </Text>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            placeholder={t("profile:lastNamePlaceholder")}
                                            required size="md" />
                                    </Box>
                                </Grid>
                            </Box>
                            <Box>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:locality")}
                                        </Text>
                                        <Input
                                            value={formData.locality}
                                            onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                                            placeholder={t("profile:localityPlaceholder")}
                                            size="md"
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("profile:bio")}
                                        </Text>
                                        <Input
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder={t("profile:bioPlaceholder")}
                                            size="md"
                                        />
                                    </Box>
                                </Grid>
                            </Box>
                            <Box>
                                <FileUpload.Root accept={["image/png"]}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm">
                                            <HiUpload /> {t("profile:uploadProfilePicture")}
                                        </Button>
                                    </FileUpload.Trigger>
                                    <FileUpload.List />
                                </FileUpload.Root>
                            </Box>
                            <Box p={4} bg="gray.50" borderRadius="md">
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
                                        checked={formData.profileState}
                                        onCheckedChange={({ checked }) =>
                                            setFormData({
                                                ...formData,
                                                profileState: checked
                                            })
                                        }
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </Flex>
                            </Box>

                            {/* Boutons d'action */}
                            <Flex gap={3} justifyContent="flex-end" flexDirection={{ base: "column", sm: "row" }} pt={4}
                                  borderTop="1px" borderColor="gray.200" >
                                <Button variant="outline" onClick={handleReset} size="lg" flex={{ base: 1, sm: "none" }} >
                                    {t("profile:actions.save")}
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    size="lg"
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