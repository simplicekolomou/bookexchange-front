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
    Show, Field, FieldLabel, CloseButton
} from '@chakra-ui/react';
import {useTranslation} from "react-i18next";
import {Availability, BookStateLabel, type isbns, type VolumeShort} from "../../types/book.types.ts";
import {BookSearchCombobox} from "./books/BookSearchCombobox.tsx";
import {FileUploadField} from "./books/FileUploadField.tsx";
import {z} from "zod";
import {Controller, type SubmitHandler, useFieldArray, useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect} from "react";
import {toaster} from "../ui/toaster.tsx";
import {useAddBookCopyMutation} from "../../features/book/bookApi.ts";

const conditionEnum = BookStateLabel.map(item => item.value) as [string, ...string[]];
const availabilityEnum = Availability.map(item => item.value) as [string, ...string[]];

// Create the author schema
const authorSchema = z.object({
    name: z.string().min(1, { message: "Author name is required" })
});

const formSchema = z.object({
    title: z.string().min(1, {message: "Title is required"}),
    authors: z.array(authorSchema),
    isbns: z
        .string()
        .min(1, { message: "ISBN is required" })
        .refine(isValidISBN, { message: "Invalid ISBN (must be ISBN-10 or ISBN-13)" }),
    bookState: z.enum(conditionEnum, {message: "Invalid book state"}),
    format: z.string(),
    edition: z.string(),
    coverImage: z.url(),
    userCoverImage: z.instanceof(File).nullable(),
    description: z.string(),
    isAvailable: z.boolean(),
    availability: z.enum(availabilityEnum),
})

type FormValues = z.infer<typeof formSchema>

const defaultValues: FormValues = {
    title: '',
    authors: [{ name: '' }],
    isbns: '',
    bookState: '',
    format: '',
    edition: '',
    coverImage: '',
    userCoverImage: null,
    description: '',
    isAvailable: false,
    availability: availabilityEnum.at(3)?? "",
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

export const AddBook = () => {
    const [addBookCopy, { isLoading, isSuccess, isError }] = useAddBookCopyMutation();

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

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            // Transform form data to match backend format
            const bookData = {
                physicalState: data.bookState,
                availabilityType: data.availability,
                askingPrice: 0, // You might want to add this to your form
                title: data.title,
                authors: data.authors.map(author => author.name), // Convert author objects to strings
                format: data.format,
                edition: data.edition,
                isbn: data.isbns,
                coverPictureApiUrl: data.coverImage,
                userUploadPicturePath: data.userCoverImage ? data.userCoverImage.name : '', // Handle file upload separately if needed
                description: data.description,
            };

            await addBookCopy(bookData).unwrap();

            // Show success message
            toaster.create({
                title: "Succès",
                description: "Le livre a été ajouté avec succès",
                type: "success",
            });

            // Reset form
            handleReset();
        } catch (error) {
            console.error('Failed to add book:', error);
            toaster.create({
                title: "Erreur",
                description: "Une erreur est survenue lors de l'ajout du livre",
                type: "error",
            });
        }
    };

    const handleReset = () => {
        reset({...defaultValues})
    };

    const { fields, append, remove} = useFieldArray<FormValues>({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: "authors",
        keyName: "id"// unique name for your Field Array
    });

    // Ensure at least one field on mount
    useEffect(() => {
        if (fields.length === 0) {
            append({ name: '' });
        }
    }, [fields, append]);

    // I18n initialisation
    const {t} = useTranslation(["common", "addBook"]);

    // Collections pour les Select
    const conditionCollection = createListCollection({
        items: BookStateLabel.map(
            (bookState) => ({
                value: bookState.value,
                label: t(`addBook:bookState.options.${bookState.value}`)
            })
        )
    });
    const availabilityCollection = createListCollection({
        items: Availability.map(
            (option) => ({
                value: option.value,
                label: t(`addBook:availability.options.${option.value}`)
            })
        )
    });

    /**
     * Permet de récupérer le meilleur ISBN
     * @param ids
     */
    function pickBestIsbn(ids?: isbns[]) {
        // console.log(ids)
        if (!ids?.length) return "";

        const isbn13 = ids.find(i => i.type === "ISBN_13");
        const isbn10 = ids.find(i => i.type === "ISBN_10");
        // console.log("isbn13", isbn13)
        // console.log("isbn10", isbn10)
        if (isbn13) {
            return isbn13.identifier;
        } else if (isbn10) {
            return isbn10.identifier;
        } else {
            return ids[0].identifier;
        }
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

                                setValue("authors", (b.authors ?? [""]).map(a => ({ name: a })));
                                setValue("isbns", pickBestIsbn(b.isbns));
                                setValue("edition", b.publishedDate);
                                setValue("coverImage", b.coverUrl);
                                console.log(b.authors)
                                console.log(typeof b.authors?.at(0))
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
                                                <Flex key={field.id} align="center" gap={2}>
                                                    <Input
                                                        {...register(`authors.${index}.name`)}
                                                        placeholder={t("addBook:book.authorPlaceholder")}
                                                        size="md"
                                                    />

                                                    <CloseButton onClick={() => remove(index)} />
                                                </Flex>
                                            ))}

                                            <Field.ErrorText>{errors.authors?.message}</Field.ErrorText>

                                            <Button
                                                m="auto"
                                                onClick={() => append({ name: '' })}
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
                                        <Controller
                                            control={control}
                                            name="userCoverImage"
                                            render={({ field }) => (
                                                <FileUploadField
                                                    value={field.value}
                                                    onChange={(file) => field.onChange(file)}
                                                    label={t("addBook:book.images.personalImage")}
                                                />
                                            )}
                                        />
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