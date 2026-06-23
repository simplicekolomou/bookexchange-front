'use client';
import {
    Button,
    Input,
    Textarea,
    Box,
    Grid,
    Image,
    VStack,
    Flex,
    Portal,
    Select,
    Show,
    Field,
    CloseButton,
    Fieldset, Text,
} from '@chakra-ui/react';
import { FileUploadField } from "./FileUploadField.tsx";
import { Controller } from "react-hook-form";
import { useAddbookController, type BookFormProps } from "../hooks/useAddbookController";
import { useTranslation } from "react-i18next";
import {BookSearchCombobox} from "./BookSearchCombobox.tsx";
import type {VolumeShort} from "../../types/book.types.ts";
import {tokens} from "../../../../theme/theme.ts";

export const BookForm = ({ mode, initialData, onSubmitSuccess, bookId }: BookFormProps) => {
    const { t } = useTranslation(["common", "addBook"]);
    const {
        form,
        fields,
        append,
        remove,
        conditionCollection,
        availabilityCollection,
        onSubmit,
        handleReset,
        pickBestIsbn
    } = useAddbookController({ mode, initialData, bookId, onSubmitSuccess });

    const { register, handleSubmit, control, setValue, watch, formState: { errors, isSubmitting } } = form;

    return (
        <>
            {/* Search Bar */}
            {(mode === "add" || mode === "wishList") && (
                <Box marginBottom={"1em"}>
                    <BookSearchCombobox
                        onSelect={(b: VolumeShort) => {
                            setValue("title", b.title);
                            setValue("authors", (b.authors ?? [""]).map(a => ({ name: a })));
                            setValue("isbns", pickBestIsbn(b.isbns));
                            setValue("edition", b.publishedDate);
                            setValue("coverImage", b.coverUrl);
                        }}
                    />
                    <Text mt={1} fontSize="xs" color="gray.500">
                        Astuce : tapez <b>Auteur - Titre</b> pour une recherche combinée.
                    </Text>
                </Box>
            )}
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <VStack gap={6} align="stretch">
                    {/* Informations de base */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:book.basicInfo")}
                        </Fieldset.Legend>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
                            <Box>
                                <Field.Root invalid={!!errors.title} >
                                    <Field.Label>{t("addBook:book.title")}</Field.Label>
                                    <Input
                                        type="text"
                                        {...register('title')}
                                        placeholder={t("addBook:book.titlePlaceholder")}
                                        required
                                        size="md"
                                        borderColor={errors.title ? "red.500" : "gray.300"}
                                    />
                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.title?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>

                            <Box>
                                <Field.Root invalid={!!errors.authors}>
                                    <Field.Label>{t("addBook:book.author")}</Field.Label>

                                    {fields.map((field, index) => (
                                        <Flex key={field.id} align="center" gap={2} direction="column">
                                            <Flex w="100%" align="center" gap={2}>
                                                <Input
                                                    type="text"
                                                    {...register(`authors.${index}.name`)}
                                                    placeholder={t("addBook:book.authorPlaceholder")}
                                                    size="md"
                                                    borderColor={errors.title ? "red.500" : "gray.300"}
                                                />
                                                <CloseButton onClick={() => remove(index)} />
                                            </Flex>
                                            <Field.ErrorText color="red.500" fontWeight="bold">
                                                { (errors.authors && Array.isArray(errors.authors) && errors.authors[index]?.name?.message)
                                                    ? errors.authors[index]?.name?.message
                                                    : null
                                                }
                                            </Field.ErrorText>
                                        </Flex>
                                    ))}

                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.authors?.message}</Field.ErrorText>

                                    <Button
                                        m="auto"
                                        width="40%"
                                        onClick={() => append({ name: '' })}
                                    >
                                        {t("addBook:book.actions.addAuthor")}
                                    </Button>
                                </Field.Root>
                            </Box>
                        </Grid>
                    </Fieldset.Root>

                    {/* Détails du livre */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:book.bookDetails")}
                        </Fieldset.Legend>
                        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>

                            {/* ISBNs */}
                            <Box>
                                <Field.Root invalid={!!errors.isbns}>
                                    <Field.Label>{t("addBook:book.isbn")}</Field.Label>
                                    <Input
                                        type="text"
                                        {...register("isbns")}
                                        placeholder={t("addBook:book.isbnPlaceholder")}
                                        borderColor={errors.title ? "red.500" : "gray.300"}
                                    />
                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.isbns?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>

                            {/* État du livre */}
                            <Field.Root invalid={!!errors.bookState}>
                                <Field.Label>{t("addBook:book.bookState")}</Field.Label>
                                <Controller
                                    control={control}
                                    name="bookState"
                                    render={({ field }) => (
                                        <Select.Root
                                            collection={conditionCollection}
                                            value={[field.value]}
                                            onValueChange={({ value }) => {
                                                field.onChange(value[0]);
                                            }}
                                            size="md"
                                        >
                                            <Select.Control>
                                                <Select.Trigger
                                                    className="add-book-select-trigger"
                                                    borderColor={errors.bookState ? "red.500" : "gray.200"}
                                                >
                                                    <Select.ValueText />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup
                                                    background ={tokens.colors.primary}
                                                    borderRadius = "5px"
                                                >
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>

                                            <Portal>
                                                <Select.Positioner>
                                                    <Select.Content bg={"gray.100"}>
                                                        {conditionCollection.items.map((item) => (
                                                            <Select.Item key={item.value} item={item}>
                                                                <Select.ItemText>{item.label}</Select.ItemText>
                                                                <Select.ItemIndicator />
                                                            </Select.Item>
                                                        ))}
                                                    </Select.Content>
                                                </Select.Positioner>
                                            </Portal>
                                        </Select.Root>
                                    )}
                                />
                                <Field.ErrorText color="red.500" fontWeight="bold">{errors.bookState?.message}</Field.ErrorText>
                            </Field.Root>

                            {/* Format du livre */}
                            <Box>
                                <Field.Root invalid={!!errors.format}>
                                    <Field.Label>{t("addBook:book.format")}</Field.Label>
                                    <Input
                                        type="text"
                                        {...register("format")}
                                        placeholder={t("addBook:book.formatPlaceholder")}
                                        borderColor={errors.format ? "red.500" : "gray.300"}
                                    />
                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.format?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>

                            {/* Édition du livre */}
                            <Box>
                                <Field.Root invalid={!!errors.edition}>
                                    <Field.Label>{t("addBook:book.edition")}</Field.Label>
                                    <Input
                                        type="text"
                                        {...register("edition")}
                                        placeholder={t("addBook:book.editionPlaceholder")}
                                        size="md"
                                        borderColor={errors.edition ? "red.500" : "gray.300"}
                                    />
                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.edition?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>
                        </Grid>
                    </Fieldset.Root>

                    {/* Images */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:book.images.title")}
                        </Fieldset.Legend>
                        <Grid templateColumns={{ base: "1fr", md: watch("coverImage") ? "repeat(2, 1fr)" : "1fr", }} gap={4}>
                            <Show when={watch("coverImage")}>
                                <Field.Root invalid={!!errors.coverImage}>
                                    <Field.Label>{t("addBook:book.images.coverImage")}</Field.Label>
                                    <Input
                                        {...register("coverImage")}
                                        placeholder="URL de l'image" size="md"
                                        display={"none"}
                                    />
                                    <Image src={watch("coverImage")} alt="Couverture" w={20} h={28} objectFit="cover"
                                           borderRadius="md" mt={2} mx="auto" />
                                    <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.coverImage?.message}</Field.ErrorText>
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
                    </Fieldset.Root>

                    {/* Description */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:book.description")}
                        </Fieldset.Legend>
                        <Field.Root invalid={!!errors.description}>
                            <Textarea
                                {...register("description")}
                                placeholder={t("addBook:book.descriptionPlaceholder")}
                                rows={4}
                                resize="vertical"
                                borderColor={errors.description ? "red.500" : "gray.200"}
                            />
                            <Field.ErrorText color="red.500" fontWeight={"bold"}>{errors.description?.message}</Field.ErrorText>
                        </Field.Root>
                    </Fieldset.Root>

                    {/* Disponibilité */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:availability.optionsLabel")}
                        </Fieldset.Legend>
                        <Field.Root invalid={!!errors.availability}>
                            <Field.Label>{t("addBook:availability.optionsLabel")}</Field.Label>
                            <Controller
                                control={control}
                                name="availability"
                                render={({ field }) => (
                                    <Select.Root
                                        collection={availabilityCollection}
                                        value={[field.value]}
                                        onValueChange={({ value }) => field.onChange(value[0])}
                                        size="md"
                                    >
                                        <Select.Control>
                                            <Select.Trigger
                                                className="add-book-select-trigger"
                                                borderColor={errors.availability ? "red.500" : "gray.200"}
                                            >
                                                <Select.ValueText />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup
                                                background ={tokens.colors.primary}
                                                borderRadius = "5px"
                                            >
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>

                                        <Portal>
                                            <Select.Positioner>
                                                <Select.Content bg={"gray.100"}>
                                                    {availabilityCollection.items.map((item) => (
                                                        <Select.Item key={item.value} item={item}>
                                                            <Select.ItemText>{item.label}</Select.ItemText>
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Portal>
                                    </Select.Root>
                                )}
                            />
                            <Field.ErrorText color="red.500" fontWeight="bold">{errors.availability?.message}</Field.ErrorText>
                        </Field.Root>
                    </Fieldset.Root>

                    {/* Boutons d'action */}
                    <Flex
                        gap={3}
                        justifyContent="flex-end"
                        flexDirection={{ base: "column", sm: "row" }}
                        pt={4}
                        borderTop="1px" borderColor="gray.200"
                    >
                        <Show when={mode === "add"}>
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                width="30%"
                                flex={{ base: 1, sm: "none" }}
                            >
                                {t("common:actions.reset")}
                            </Button>
                        </Show>
                        <Button
                            type="submit"
                            width="30%"
                            flex={{ base: 1, sm: "none" }}
                            loading={isSubmitting}
                        >
                            {mode === "add" ? t("common:actions.add") : t("common:actions.save")}
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </>
    );
};