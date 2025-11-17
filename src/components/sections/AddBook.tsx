import { useState } from 'react';
import { Button, Input, Textarea, Box, Grid, Image, Text, VStack, Flex, Switch, Portal, Select, createListCollection, Container, Heading, } from '@chakra-ui/react';
import {useTranslation} from "react-i18next";
import { Availability, BookStateLabel} from "../../types/bookApi.ts";


export const AddBook = () => {
    // Collections pour les Select
    const conditionCollection = createListCollection({
        items: BookStateLabel.map(
            (bookState) => ({ value: bookState.value, label: bookState.label })
        )
    });


    const availabilityCollection = createListCollection({
        items: Availability.map(
            (option) => ({ value: option.value, label: option.label })
        )
    });


    const [formData, setFormData] = useState({
        title: '',
        author: '',
        isbn: '',
        bookState: '',
        format: '',
        edition: '',
        coverImage: '',
        userCoverImage: '',
        description: '',
        isAvailable: false,
        availability: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Livre ajouté :", formData);
        // TODO : Ajouter la logique pour envoyer les données au backend
    };

    const handleReset = () => {
        setFormData({
            title: '',
            author: '',
            isbn: '',
            bookState: '',
            format: '',
            edition: '',
            coverImage: '',
            userCoverImage: '',
            description: '',
            isAvailable: false,
            availability: ''
        });
    };
    const {t} = useTranslation(["common", "addBook"]);

    return (
        <Box className="add-book-container">
            <Container maxW="4xl" py={8}>
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    {t("addBook:title")}
                </Heading>

                {/* Formulaire */}
                <Box bg="white" borderRadius="lg" p={{ base: 4, md: 6 }} boxShadow="sm" border="1px" borderColor="gray.100" >
                    <form onSubmit={handleSubmit}>
                        <VStack gap={6} align="stretch">
                            {/* Informations de base */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.basicInfo")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.title")}
                                        </Text>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder={t("addBook:book.titlePlaceholder")} required size="md" />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.author")}
                                        </Text>
                                        <Input
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            placeholder={t("addBook:book.authorPlaceholder")}
                                            required size="md" />
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Détails du livre */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.bookDetails")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.isbn")}
                                        </Text>
                                        <Input
                                            value={formData.isbn}
                                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                                            placeholder={t("addBook:book.isbnPlaceholder")}
                                            size="md"
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.bookState")}
                                        </Text>
                                        <Select.Root
                                            collection={conditionCollection}
                                            value={[formData.bookState]}
                                            onValueChange={({ value }) => setFormData({ ...formData, bookState: value[0] })}
                                            size="md"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger  className="add-book-select-trigger">
                                                    <Select.ValueText />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content  bg={"gray.100"}>
                                                        {conditionCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item.label}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.format")}
                                        </Text>
                                        <Input
                                            value={formData.format}
                                            onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                                            placeholder={t("addBook:book.formatPlaceholder")}
                                            size="md"
                                        />
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.edition")}
                                        </Text>
                                        <Input
                                            value={formData.edition}
                                            onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                                            placeholder={t("addBook:book.editionPlaceholder")}
                                            size="md"
                                        />
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Images */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.images.title")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.images.coverImage")}
                                        </Text>
                                        <Input
                                            value={formData.coverImage}
                                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                            placeholder="URL de l'image" size="md" />
                                        {formData.coverImage && (
                                            <Image src={formData.coverImage} alt="Couverture" w={20} h={28} objectFit="cover"
                                                borderRadius="md" mt={2} mx="auto" />
                                        )}
                                    </Box>

                                    <Box>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:book.images.personalImage")}
                                        </Text>
                                        <Input
                                            value={formData.userCoverImage}
                                            onChange={(e) => setFormData({ ...formData, userCoverImage: e.target.value })}
                                            placeholder={t("addBook:book.images.personalImagePlaceholder")} size="md" />
                                        {formData.userCoverImage && (
                                            <Image src={formData.userCoverImage} alt="Image personnelle" w={20} h={28} objectFit="cover"
                                                borderRadius="md" mt={2} mx="auto" />
                                        )}
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Description */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.description")}
                                </Text>
                                <Textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder={t("addBook:book.descriptionPlaceholder")}
                                    rows={4}
                                    resize="vertical"
                                />
                            </Box>

                            {/* Disponibilité */}
                            <Box p={4} bg="gray.50" borderRadius="md">
                                <Flex alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
                                    <Box flex="1">
                                        <Text fontWeight="medium" mb={1} fontSize="sm" color="gray.800">
                                            {t("addBook:availability.title")}
                                        </Text>
                                        <Text fontSize="sm" color="gray.600">
                                            {t("addBook:availability.subtitle")}
                                        </Text>
                                    </Box>
                                    <Switch.Root
                                        checked={formData.isAvailable}
                                        onCheckedChange={({ checked }) =>
                                            setFormData({
                                                ...formData,
                                                isAvailable: checked,
                                                availability: checked ? 'echanger' : 'none',
                                            })
                                        }
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                </Flex>

                                {formData.isAvailable && (
                                    <Box mt={4}>
                                        <Text fontWeight="medium" mb={2} fontSize="sm" color="gray.700">
                                            {t("addBook:availability.options")}
                                        </Text>
                                        <Select.Root
                                            collection={availabilityCollection}
                                            value={[formData.availability]}
                                            onValueChange={({ value }) => setFormData({ ...formData, availability: value[0] })}
                                            size="md"
                                        >
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger className="add-book-select-trigger">
                                                    <Select.ValueText />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content bg={"gray.100"}>
                                                        {availabilityCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item.label}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    </Box>
                                )}
                            </Box>

                            {/* Boutons d'action */}
                            <Flex gap={3} justifyContent="flex-end" flexDirection={{ base: "column", sm: "row" }} pt={4}
                                borderTop="1px" borderColor="gray.200" >
                                <Button variant="outline" onClick={handleReset} size="lg" flex={{ base: 1, sm: "none" }} >
                                    {t("common:actions.reset")}
                                </Button>
                                <Button
                                    colorScheme="blue"
                                    type="submit"
                                    size="lg"
                                    flex={{ base: 1, sm: "none" }}
                                >
                                    {t("common:actions.add")}
                                </Button>
                            </Flex>
                        </VStack>
                    </form>
                </Box>
            </Container>
        </Box>
    );
};