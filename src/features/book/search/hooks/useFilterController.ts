import { useTranslation } from "react-i18next";
import { tokens } from "../../../../theme/theme.ts";

type StateValues = "new" | "veryGood" | "good" | "decent" | "";

export type FilterValues = {
    availability: boolean;
    bookState: StateValues;
};

interface UseFilterBoxOptions {
    values?: Partial<FilterValues>;
    onChange?: (values: FilterValues) => void;
}

const defaultValues: FilterValues = {
    availability: false,
    bookState: "",
};

export const BOOK_STATES = ["new", "veryGood", "good", "decent"] as const;
export const useFilterController = ({ values, onChange }: UseFilterBoxOptions) => {
    const { t } = useTranslation("search");

    const filterState: FilterValues = { ...defaultValues, ...(values || {}) };

    const handleAvailabilityChange = (details: unknown) => {
        const isChecked = Boolean(
            details && (details as { checked?: boolean }).checked
        );
        onChange?.({ ...filterState, availability: isChecked });
    };

    const handleStateChange = (details: unknown) => {
        const val =
            typeof details === "string"
                ? details
                : (details && (details as { value?: string | null }).value) ?? "";
        onChange?.({ ...filterState, bookState: val as StateValues });
    };

    return {
        t,
        tokens,
        filterState,
        handleAvailabilityChange,
        handleStateChange,
    };
}