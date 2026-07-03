import {useEffect, useMemo, useState} from "react";
import {useForm, useFieldArray, type SubmitHandler} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useTranslation} from "react-i18next";
import {createListCollection, useListCollection} from "@chakra-ui/react";
import {
    useAddBookCopyMutation, useAddBookCopyToWishListMutation, useGetBookSuggestionsQuery,
    useUpdateBookCopyMutation,
} from "../../api/bookApi.ts";
import {toaster} from "../../../../components/ui/toasterInstance.tsx";
import {Availability, BookStateLabel, type VolumeShort} from "../../types/book.types.ts";
import type {isbns} from "../../types/book.types.ts";
import {useDebouncedController} from "../../../../hooks/useDebouncedController.ts";

const authorSchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, {message: t("validation.requiredAuthor")}),
    });

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
// Schéma Zod & types dérivés
// -------------------------------------------------------------------
const conditionEnum = BookStateLabel.map((item) => item.value) as [
    string,
    ...string[],
];

const availabilityEnum = Availability.map((item) => item.value) as [
    string,
    ...string[],
];

// Schéma de validation du formulaire
const bookFormSchema = (t: (key: string) => string) =>
    z.object({
        id: z
            .string().optional(),
        title: z
            .string()
            .min(1, {message: t("validation.requiredTitle")}),
        authors: z
            .array(authorSchema(t))
            .min(1, {message: t("validation.requiredAuthor")}),
        isbns: z
            .string()
            .refine(isValidISBN, {message: t("validation.invalidISBN")}),
        bookState: z
            .enum(conditionEnum, {message: t("validation.invalidBookState")}),
        format: z
            .string()
            .min(1, {message: t("validation.invalidFormat")}),
        edition: z
            .string()
            .min(1, {message: t("validation.invalidEdition")}),
        coverImage: z
            .httpUrl()
            .optional(),
        userCoverImage: z
            .instanceof(File)
            .nullable(),
        description: z
            .string()
            .min(1, {message: t("validation.requiredDescription")}),
        isAvailable: z
            .boolean(),
        availability: z
            .enum(availabilityEnum, {message: t("validation.invalidAvailability")}),
    });

type BookForm = z.infer<ReturnType<typeof bookFormSchema>>;

export interface BookFormType {
    id?: string;
    title: string;
    authors: { name: string }[];
    isbns: string;
    bookState: string;
    format: string;
    edition: string;
    coverImage?: string | "";
    userCoverImage: File | null;
    description: string;
    isAvailable: boolean;
    availability: string;
}

// -------------------------------------------------------------------
// Types & paramètres du hook
// -------------------------------------------------------------------
export interface BookFormProps {
    mode: "add" | "edit" | "wishList";
    initialData?: Partial<BookFormType>;
    onSubmitSuccess?: () => void;
    bookId?: string; // requis en mode "edit"
}

// -------------------------------------------------------------------
// Hook principal
// -------------------------------------------------------------------
export const useAddbookController = (props?: BookFormProps | null) => {
    const {t} = useTranslation(["addBook"]);

    const {
        mode = "add",
        initialData,
        bookId,
        onSubmitSuccess,
    } = props ?? {};

    const limit = 10;
    const lang = "fr";
    const initialQuery = "";
    const [inputValue, setInputValue] = useState(initialQuery);
    const debouncedController = useDebouncedController(300, inputValue);

    const form = useForm<BookForm>({
        resolver: zodResolver(bookFormSchema(t)),
        defaultValues: {
            id: initialData?.id ?? "",
            title: initialData?.title ?? "",
            authors: initialData?.authors ?? [{name: ""}],
            isbns: initialData?.isbns ?? "",
            bookState: initialData?.bookState ?? conditionEnum[0],
            format: initialData?.format ?? "",
            edition: initialData?.edition ?? "",
            coverImage: initialData?.coverImage ?? undefined,
            userCoverImage: null,
            description: initialData?.description ?? "",
            isAvailable: initialData?.isAvailable ?? false,
            availability: initialData?.availability ?? availabilityEnum[0],
        }
    });

    const {control, reset} = form;

    const [addBookCopy] = useAddBookCopyMutation();
    const [updateBookCopy] = useUpdateBookCopyMutation();
    const [addBookToWishlist] = useAddBookCopyToWishListMutation();

    // Champ dynamique pour les auteurs
    const {fields, append, remove} = useFieldArray({
        control,
        name: "authors",
    });

    // Au moins un auteur obligatoire
    useEffect(() => {
        if (fields.length === 0) {
            append({name: ""});
        }
    }, [fields, append]);

    // Soumission
    const onSubmit: SubmitHandler<BookForm> = async (data) => {
        try {
            const bookData = {
                id: bookId,
                physicalState: data.bookState ?? conditionCollection.items[0]?.value ?? "",
                availabilityType: data.availability ?? availabilityCollection.items[0]?.value ?? "",
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
            } else if (mode === "edit" && bookId) {
                await updateBookCopy(bookData).unwrap();
            } else {
                await addBookToWishlist(bookData).unwrap();
            }

            toaster.create({
                title: t("common:success"),
                description:
                    mode === "add"
                        ? t("addBook:success.add", {title: data.title})
                        : t("addBook:success.edit", {title: data.title}),
                type: "success",
                closable: true,
            });

            onSubmitSuccess?.();
            if (mode === "add") reset();
        } catch {
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
    const handleReset = () => reset();

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


    // Chakra collection state
    const {collection, set} = useListCollection<VolumeShort>({
        initialItems: [],
        itemToString: (item) => item.title,
        itemToValue: (item) => item.id,
    });

    // Compute query args (title/author) from debounced input
    const searchArgs = useMemo(() => {
        const q = debouncedController.debounced.trim();
        if (!q) return null;

        const dash = q.indexOf(" - ");
        const author = dash > 0 ? q.slice(0, dash).trim() : undefined;
        const title = dash > 0 ? q.slice(dash + 3).trim() : q;

        return {
            title: title || undefined,
            author: author || undefined,
            lang,
            limit,
        };
    }, [debouncedController.debounced, lang, limit]);

    // Call backend via RTK Query
    const {
        data,
        isFetching,
        isError,
        error,
    } = useGetBookSuggestionsQuery(searchArgs!, {
        skip: !searchArgs,
    });

    // Sync RTK Query data into Chakra collection
    useEffect(() => {
        if (!searchArgs) {
            set([]);
            return;
        }
        if (data) {
            set(data);
        } else if (!isFetching && !data) {
            set([]);
        }
    }, [data, isFetching, searchArgs, set]);

    // Normalize error message
    let errorMessage: string | null = null;
    if (isError && error) {
        if ("status" in error) {
            errorMessage = typeof error.data === "string"
                ? error.data
                : `HTTP ${error.status}`;
        } else {
            errorMessage = error.message ?? "Network error";
        }
    }

    return {
        // Form state & handlers
        /*control,
        register,
        handleSubmit,
        errors,
        isSubmitting,
        setValue,
        watch,*/
        form,
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
        // Search collection state
        collection,
        set,
        // Arguments pour la recherche
        searchArgs,

        //Input state for search
        inputValue,
        setInputValue,
        // RTK Query state
        data,
        isFetching,
        isError,
        error,
        // Erreurs normalisées
        errorMessage,

        debouncedController,
    };
};