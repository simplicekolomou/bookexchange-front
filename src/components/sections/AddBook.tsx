'use client';
import {
    Button,
    Input,
    Textarea,
    Box,
    Grid,
    Image,
    Text,
    VStack,
    Flex,
    Portal,
    Select,
    createListCollection,
    Container,
    Heading,
    FileUpload, Float, useFileUploadContext, Show, Field, FieldLabel
} from '@chakra-ui/react';
import {useTranslation} from "react-i18next";
import {Availability, BookStateLabel, type isbns, type VolumeShort} from "../../types/book.types.ts";
import {BookSearchCombobox} from "./books/BookSearchCombobox.tsx";
import {LuFileImage, LuX} from "react-icons/lu";
import { z } from "zod";
import {type SubmitHandler, useFieldArray, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";

const conditionEnum = BookStateLabel.map(item => item.value) as [string, ...string[]];
const availabilityEnum = Availability.map(item => item.value) as [string, ...string[]];

const formSchema = z.object({
    title: z.string().min(1, {message: "Title is required"}),
    authors: z.array(z.string()),
    isbns: z.string().min(1, {message: "Isbn is required"}),
    bookState: z.enum(conditionEnum, {message: "Invalid book state"}),
    format: z.string(),
    edition: z.string(),
    coverImage: z.url(),
    userCoverImage: z.file().optional(),
    description: z.string(),
    isAvailable: z.boolean(),
    availability: z.enum(availabilityEnum),
})

const defaultValues = {
    title: '',
    authors: [''],
    isbns: '',
    bookState: '',
    format: '',
    edition: '',
    coverImage: '',
    userCoverImage: undefined,
    description: '',
    isAvailable: false,
    availability: ''
}

type FormValues = z.infer<typeof formSchema>

export const AddBook = () => {
    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors },
        setValue,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => console.log(data);

    const handleReset = () => {
        reset(defaultValues)
    };

    const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "authors", // unique name for your Field Array
    });

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

    /**
     * Permet de récupérer le meilleur ISBN
     * @param ids
     */
    function pickBestIsbn(ids?: isbns[]) {
        console.log(ids)
        if (!ids?.length) return "";

        const isbn13 = ids.find(i => i.type === "ISBN_13");
        const isbn10 = ids.find(i => i.type === "ISBN_10");
        console.log("isbn13", isbn13)
        console.log("isbn10", isbn10)
        if (isbn13) {
            return isbn13.identifier;
        } else if (isbn10) {
            return isbn10.identifier;
        } else {
            return undefined;
        }
        // return isbn13?.identifier ?? isbn10?.identifier ?? ids[0].identifier;
    }

    const {t} = useTranslation(["common", "addBook"]);

    const FileUploadList = () => {
        const fileUpload = useFileUploadContext()
        const files = fileUpload.acceptedFiles
        if (files.length === 0) return null
        return (
            <FileUpload.ItemGroup>
                {files.map((file) => (
                    <FileUpload.Item
                        w="auto"
                        boxSize="20"
                        p="2"
                        file={file}
                        key={file.name}
                        mx="auto"
                    >
                        <FileUpload.ItemPreviewImage />
                        <Float placement="top-end">
                            <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                                <LuX />
                            </FileUpload.ItemDeleteTrigger>
                        </Float>
                    </FileUpload.Item>
                ))}
            </FileUpload.ItemGroup>
        )
    }

    /* Validation d'ISBN */

    /**
     * Check pour les 2 types d'ISBN (10 et 13)
     * @param isbn Un string contenant uniquement l'isbn
     */
    function isValidISBN(isbn: string): boolean {
        const clean = isbn.replace(/[-\s]/g, "");
        return isValidISBN10(clean) || isValidISBN13(clean);
    }

    /**
     * Check la validité d'un ISBN-10
     * @param isbn Un string contenant uniquement l'isbn
     */
    function isValidISBN10(isbn: string): boolean {
        isbn = isbn.replace(/[-\s]/g, "");
        if (!/^\d{9}[\dX]$/.test(isbn)) return false;

        let sum = 0;
        for (let i = 0; i < 10; i++) {
            const char = isbn[i] === "X" ? 10 : Number(isbn[i]);
            sum += char * (10 - i);
        }
        return sum % 11 === 0;
    }

    /**
     * Check la validité d'un ISBN-13
     * @param isbn Un string contenant uniquement l'isbn
     */
    function isValidISBN13(isbn: string): boolean {
        isbn = isbn.replace(/[-\s]/g, "");
        if (!/^\d{13}$/.test(isbn)) return false;

        let sum = 0;
        for (let i = 0; i < 13; i++) {
            const digit = Number(isbn[i]);
            sum += i % 2 === 0 ? digit : digit * 3;
        }
        return sum % 10 === 0;
    }



    return (
        <Box className="add-book-container">
            <Container maxW="4xl" py={8}>
                {/* En-tête du formulaire */}
                <Heading as="h1" fontSize="3xl" mb="6" pt="4">
                    {t("addBook:title")}
                </Heading>

                {/* Formulaire */}
                <Box bg="white" borderRadius="lg" p={{ base: 4, md: 6 }} boxShadow="sm" border="1px" borderColor="gray.100">

                    {/* Search Bar */}
                    <Box marginBottom={"1em"}>
                        <BookSearchCombobox
                            lang="fre"
                            limit={10}
                            onSelect={(b: VolumeShort) => {
                                setValue("title", b.title);
                                setValue("authors", b.authors);
                                setValue("isbns", pickBestIsbn(b.isbns));
                                setValue("edition", b.publishedDate);
                                setValue("coverImage", b.coverUrl);
                            }}

                        />
                        <Text mt={1} fontSize="xs" color="gray.500">
                            Astuce : tapez <b>Auteur - Titre</b> pour une recherche combinée.
                        </Text>
                    </Box>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <VStack gap={6} align="stretch">
                            {/* Informations de base */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.basicInfo")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                                    <Box>
                                        <Field.Root invalid={!!errors.title} >
                                            <Field.Label>{t("addBook:book.title")}</Field.Label>
                                        <Input
                                            {...register('title')}
                                            placeholder={t("addBook:book.titlePlaceholder")} required size="md" />
                                            <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Box>

                                    <Box>
                                        <Field.Root invalid={!!errors.authors}>
                                            <FieldLabel>{t("addBook:book.author")}</FieldLabel>

                                            {fields.map((field, index) => (
                                                <Input
                                                    key={field.id}
                                                    {...register(`authors.${index}`)}
                                                    placeholder={t("addBook:book.authorPlaceholder")}
                                                    size="md"
                                                />
                                            ))}

                                            <Field.ErrorText>{errors.authors?.message}</Field.ErrorText>

                                            <Button
                                                m="auto"
                                                onClick={() => append("")}
                                            >
                                                Ajouter un auteur
                                            </Button>
                                        </Field.Root>
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
                                        <Field.Root invalid={!!errors.isbns}>
                                            <Field.Label>{t("addBook:book.isbn")}</Field.Label>
                                            <Input
                                                {...register("isbns")}
                                                placeholder={t("addBook:book.isbnPlaceholder")}
                                            />
                                            <Field.ErrorText>{errors.isbns?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Box>

                                    <Field.Root invalid={!!errors.bookState}>
                                        <Field.Label>{t("addBook:book.bookState")}</Field.Label>
                                        <Select.Root
                                            collection={conditionCollection}
                                            value={watch("bookState") ? [watch("bookState")] : []}

                                            onValueChange={({ value }) =>
                                                setValue("bookState", value[0], { shouldValidate: true })
                                            }
                                            size="md"
                                        >
                                            <Select.HiddenSelect {...register("bookState")} />
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
                                                        {conditionCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>    {/* FIXED HERE */}
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                        <Field.ErrorText>{errors.bookState?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Box>
                                        <Field.Root invalid={!!errors.format}>
                                            <Field.Label>{t("addBook:book.format")}</Field.Label>

                                            <Input
                                                {...register("format")}
                                                placeholder={t("addBook:book.formatPlaceholder")}
                                            />
                                            <Field.ErrorText>{errors.format?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Box>

                                    <Box>
                                        <Field.Root invalid={!!errors.edition}>
                                            <Field.Label>{t("addBook:book.edition")}</Field.Label>
                                            <Input
                                                {...register("edition")}
                                                placeholder={t("addBook:book.editionPlaceholder")}
                                                size="md"
                                            />
                                            <Field.ErrorText>{errors.edition?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Box>
                                </Grid>
                            </Box>

                            {/* Images */}
                            <Box>
                                <Text fontSize="lg" fontWeight="semibold" color="gray.800" mb={4}>
                                    {t("addBook:book.images.title")}
                                </Text>
                                <Grid templateColumns={{ base: "1fr", md: watch("coverImage") ? "repeat(2, 1fr)" : "1fr", }} gap={4}>
                                    <Show when={watch("coverImage")}>
                                        <Field.Root invalid={!!watch("coverImage")}>
                                            <Field.Label>{t("addBook:book.images.coverImage")}</Field.Label>
                                            <Input
                                                {...register("coverImage")}
                                                placeholder="URL de l'image" size="md"
                                                display={"none"}
                                            />
                                            <Image src={watch("coverImage")} alt="Couverture" w={20} h={28} objectFit="cover"
                                                borderRadius="md" mt={2} mx="auto" />
                                            <Field.ErrorText>{errors.coverImage?.message}</Field.ErrorText>
                                        </Field.Root>
                                    </Show>

                                    <Box mx="auto">
                                        <FileUpload.Root accept="image/*">
                                            <FileUpload.Label>{t("addBook:book.images.personalImage")}</FileUpload.Label>
                                            <FileUpload.HiddenInput />
                                            <FileUpload.Trigger asChild>
                                                <Button variant="outline" size="sm" mx="auto">
                                                    <LuFileImage /> Upload Images
                                                </Button>
                                            </FileUpload.Trigger>
                                            <FileUploadList />
                                        </FileUpload.Root>
                                    </Box>

                                </Grid>
                            </Box>

                            {/* Description */}
                            <Box>
                                <Field.Root invalid={!!watch("description")}>
                                    <Field.Label>{t("addBook:book.description")}</Field.Label>
                                    <Textarea
                                        {...register("description")}
                                        placeholder={t("addBook:book.descriptionPlaceholder")}
                                        rows={4}
                                        resize="vertical"
                                    />
                                    <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>

                            <Box>
                                <Field.Root invalid={!!errors.availability}>
                                    <Field.Label>{t("addBook:availability.options")}</Field.Label>
                                    <Select.Root
                                        collection={availabilityCollection}
                                        value={watch("availability") ? [watch("availability")] : []}

                                        onValueChange={({ value }) =>
                                            setValue("availability", value[0], { shouldValidate: true })
                                        }
                                        size="md"
                                    >
                                        <Select.HiddenSelect {...register("availability")} />
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
                                                        <Select.Item key={item.value} item={item}>    {/* FIXED HERE */}
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                    <Field.ErrorText>{errors.availability?.message}</Field.ErrorText>
                                </Field.Root>
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