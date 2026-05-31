import { useEffect } from "react";
import { useForm, useFieldArray, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { createListCollection } from "@chakra-ui/react";
import {
    useAddBookCopyMutation,
    useUpdateBookCopyMutation,
} from "../../api/bookApi.ts";
import { toaster } from "../../../../components/toaster/toasterInstance.tsx";
import { Availability, BookStateLabel } from "../../../../types/book.types.ts";
import type { isbns } from "../../../../types/book.types.ts";

// -------------------------------------------------------------------
// 1. Types & paramètres du hook
// -------------------------------------------------------------------
export interface BookFormProps {
    mode: "add" | "edit";
    initialData?: Partial<FormValues>;
    onSubmitSuccess?: () => void;
    bookId?: number; // requis en mode "edit"
}

// -------------------------------------------------------------------
// 2. Schéma Zod & types dérivés
// -------------------------------------------------------------------
const conditionEnum = BookStateLabel.map((item) => item.value) as [
    string,
    ...string[],
];
const availabilityEnum = Availability.map((item) => item.value) as [
    string,
    ...string[],
];

const authorSchema = z.object({
    name: z.string().min(1, { message: "Author name is required" }),
});

const formSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    authors: z.array(authorSchema).min(1, "At least one author is required"),
    isbns: z
        .string()
        .refine(isValidISBN, { message: "Invalid ISBN (must be ISBN-10 or ISBN-13)" }),
    bookState: z.enum(conditionEnum, { message: "Invalid book state" }),
    format: z.string().min(1, "Format is required"),
    edition: z.string().min(1, "Edition is required"),
    coverImage: z.string().url().optional().or(z.literal("")),
    userCoverImage: z.instanceof(File).nullable(),
    description: z.string().min(1, "Description is required"),
    isAvailable: z.boolean(),
    availability: z.enum(availabilityEnum, { message: "Invalid availability" }),
});

type FormValues = z.infer<typeof formSchema>;

// -------------------------------------------------------------------
// 3. Fonctions de validation ISBN (conservées)
// -------------------------------------------------------------------
function isValidISBN(isbn: string): boolean {
    const clean = isbn.replace(/[-\s]/g, "");
    return isValidISBN10(clean) || isValidISBN13(clean) || clean.length === 0;
}

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

// -------------------------------------------------------------------
// 4. Hook principal
// -------------------------------------------------------------------
export const useAddbookController = ({
                                         mode,
                                         initialData,
                                         bookId,
                                         onSubmitSuccess,
                                     }: BookFormProps) => {
    const { t } = useTranslation(["common", "addBook"]);

    // Valeurs par défaut (fusion avec initialData)
    const defaultValues: FormValues = {
        title: initialData?.title ?? "",
        authors: initialData?.authors ?? [{ name: "" }],
        isbns: initialData?.isbns ?? "",
        bookState: initialData?.bookState ?? conditionEnum[0],
        format: initialData?.format ?? "",
        edition: initialData?.edition ?? "",
        coverImage: initialData?.coverImage ?? undefined,
        userCoverImage: null,
        description: initialData?.description ?? "",
        isAvailable: initialData?.isAvailable ?? false,
        availability: initialData?.availability ?? availabilityEnum[0],
    };

    const {
        control,
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        setValue,
        watch,
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    const [addBookCopy] = useAddBookCopyMutation();
    const [updateBookCopy] = useUpdateBookCopyMutation();

    // Champ dynamique pour les auteurs
    const { fields, append, remove } = useFieldArray({
        control,
        name: "authors",
    });

    // Au moins un auteur obligatoire
    useEffect(() => {
        if (fields.length === 0) {
            append({ name: "" });
        }
    }, [fields, append]);

    // Soumission
    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        try {
            const bookData = {
                id: bookId,
                physicalState: data.bookState,
                availabilityType: data.availability,
                askingPrice: 0, // à adapter si besoin
                title: data.title,
                authors: data.authors.map((a) => a.name),
                format: data.format,
                edition: data.edition,
                isbn: data.isbns,
                coverPictureApiUrl: data.coverImage,
                userUploadPicturePath: data.userCoverImage?.name ?? "",
                description: data.description,
            };

            if (mode === "add") {
                await addBookCopy(bookData).unwrap();
            } else {
                await updateBookCopy(bookData).unwrap();
            }

            toaster.create({
                title: t("common:success"),
                description:
                    mode === "add"
                        ? t("addBook:success.add", { title: data.title })
                        : t("addBook:success.edit", { title: data.title }),
                type: "success",
                closable: true,
            });

            onSubmitSuccess?.();
            if (mode === "add") reset(defaultValues);
        } catch (error) {
            console.error("Failed to save book:", error);
            toaster.create({
                title: t("common:error"),
                description:
                    mode === "add"
                        ? t("addBook:error.add")
                        : t("addBook:error.edit"),
                type: "error",
                closable: true,
            });
        }
    };

    // Reset manuel
    const handleReset = () => reset(defaultValues);

    // Collections pour les Select Chakra
    const conditionCollection = createListCollection({
        items: BookStateLabel.map((state) => ({
            value: state.value,
            label: t(`addBook:bookState.options.${state.value}`),
        })),
    });

    const availabilityCollection = createListCollection({
        items: Availability.map((option) => ({
            value: option.value,
            label: t(`addBook:availability.options.${option.value}`),
        })),
    });

    // Utilitaire pour choisir le meilleur ISBN (conservé)
    const pickBestIsbn = (ids?: isbns[]) => {
        if (!ids?.length) return "";
        const isbn13 = ids.find((i) => i.type === "ISBN_13");
        const isbn10 = ids.find((i) => i.type === "ISBN_10");
        return isbn13?.identifier ?? isbn10?.identifier ?? ids[0].identifier;
    };

    return {
        // Form state & handlers
        control,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        setValue,
        watch,
        onSubmit,
        handleReset,
        // Field array
        fields,
        append,
        remove,
        // Data for selects
        conditionCollection,
        availabilityCollection,
        // Utility
        pickBestIsbn,
    };
};