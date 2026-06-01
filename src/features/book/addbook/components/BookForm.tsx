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
import type {VolumeShort} from "../../../../types/book.types.ts";

export const BookForm = ({ mode, initialData, onSubmitSuccess, bookId }: BookFormProps) => {
    const { t } = useTranslation(["common", "addBook"]);
    const {
        control,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        setValue,
        watch,
        fields,
        append,
        remove,
        conditionCollection,
        availabilityCollection,
        onSubmit,
        handleReset,
        pickBestIsbn
    } = useAddbookController({ mode, initialData, bookId, onSubmitSuccess });

    return (
        <>
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
                    }}
                />
                <Text mt={1} fontSize="xs" color="gray.500">
                    Astuce : tapez <b>Auteur - Titre</b> pour une recherche combinée.
                </Text>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                                        {...register('title')}
                                        placeholder={t("addBook:book.titlePlaceholder")} required size="md" />
                                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                                </Field.Root>
                            </Box>

                            <Box>
                                <Field.Root invalid={!!errors.authors}>
                                    <Field.Label>{t("addBook:book.author")}</Field.Label>

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
                    </Fieldset.Root>

                    {/* Détails du livre */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:book.bookDetails")}
                        </Fieldset.Legend>
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
                                                    <Select.Item key={item.value} item={item}>
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
                            />
                            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
                        </Field.Root>
                    </Fieldset.Root>

                    {/* Disponibilité */}
                    <Fieldset.Root>
                        <Fieldset.Legend fontSize="lg" fontWeight="semibold" mb={4}>
                            {t("addBook:availability.optionsLabel")}
                        </Fieldset.Legend>
                        <Field.Root invalid={!!errors.availability}>
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
                                                <Select.Item key={item.value} item={item}>
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
                    </Fieldset.Root>

                    {/* Boutons d'action */}
                    <Flex gap={3} justifyContent="flex-end" flexDirection={{ base: "column", sm: "row" }} pt={4}
                          borderTop="1px" borderColor="gray.200" >
                        <Show when={mode === "add"}>
                            <Button variant="outline" onClick={handleReset} size="lg" flex={{ base: 1, sm: "none" }} >
                                {t("common:actions.reset")}
                            </Button>
                        </Show>
                        <Button
                            type="submit"
                            size="lg"
                            flex={{ base: 1, sm: "none" }}
                            loading={isSubmitting}
                        >
                            {mode === "add" ? t("common:actions.add") : t("common:actions.edit")}
                        </Button>
                    </Flex>
                </VStack>
            </form>
        </>
    );
};