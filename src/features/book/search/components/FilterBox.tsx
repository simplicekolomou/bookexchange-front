import { Box, Checkbox, RadioGroup, Stack } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import {tokens} from "../../../../theme/theme.ts";

type StateValues = "new" | "veryGood" | "good" | "decent" | "";


export type FilterValues = {
    availability: boolean;
    bookState: StateValues;
};

interface Props {
    values?: Partial<FilterValues>;
    onChange?: (values: { availability: boolean; bookState: StateValues }) => void;
}

const defaultValues: FilterValues = {
    availability: false,
    bookState: "",
};

export const FilterBox = ({ values, onChange }: Props) => {
    const { t } = useTranslation("search");
    const filterState: FilterValues = { ...defaultValues, ...(values || {}) };

    const handleDisponibilityChange = (details: unknown) => {
        const isChecked = Boolean(details && (details as { checked?: boolean }).checked);
        onChange?.({ ...filterState, availability: isChecked });
    };


    const handleStateChange = (details: unknown) => {
        const val =
            typeof details === "string"
                ? details
                : (details && (details as { value?: string | null }).value) ?? "";
        onChange?.({ ...filterState, bookState: val as StateValues });
    };

    return (
        <Box display="flex" flexDirection="column" gap={4} mb={4} mt={2}>
            <Checkbox.Root
                checked={filterState.availability}
                onCheckedChange={handleDisponibilityChange}
                colorScheme="blue"
                defaultChecked
                borderColor={tokens.colors.primary}
            >
                <strong>{t("filter.title")} :&nbsp;</strong>
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor={tokens.colors.primary} />
                <Checkbox.Label>
                    {t("filter.disponibility")}
                </Checkbox.Label>
            </Checkbox.Root>

            <Stack direction={{ base: "column", md: "row" }} gap={{ base: 2, md: 4 }} align={{ base: "stretch", md: "center" }}>
                <Box as="strong" mb={{ base: 2, md: 0 }}>
                    {t("filter.state")} :
                </Box>
                <RadioGroup.Root
                    value={filterState.bookState}
                    onValueChange={handleStateChange}
                >
                    <Stack direction={{ base: "column", md: "row" }} gap={{ base: 2, md: 6 }}>
                        {["new", "veryGood", "good", "decent"].map((state) => (
                            <RadioGroup.Item key={state} value={state} colorScheme="blue">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator borderColor={tokens.colors.primary} />
                                <RadioGroup.ItemText>{t(`filter.${state}`)}</RadioGroup.ItemText>
                            </RadioGroup.Item>
                        ))}
                    </Stack>
                </RadioGroup.Root>
            </Stack>
        </Box>
    );
};
