import { Box, Checkbox, RadioGroup, Stack } from "@chakra-ui/react";
import {BOOK_STATES, type FilterValues, useSearchController} from "../hooks/useSearchController.ts";

interface Props {
    values?: Partial<FilterValues>;
    onChange?: (values: FilterValues) => void;
}

export const FilterBox = ({ values, onChange }: Props) => {
    const {
        t,
        tokens,
        filterState,
        handleAvailabilityChange,
        handleStateChange,
    } = useSearchController({ values, onChange });

    return (
        <Box display="flex" flexDirection="column" gap={4} mb={4} mt={2}>
            <Checkbox.Root
                checked={filterState.availability}
                onCheckedChange={handleAvailabilityChange}
                colorScheme="blue"
                defaultChecked
                borderColor={tokens.colors.primary}
            >
                <strong>{t("filter.title")} :&nbsp;</strong>
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor={tokens.colors.primary} />
                <Checkbox.Label>{t("filter.disponibility")}</Checkbox.Label>
            </Checkbox.Root>

            <Stack
                direction={{ base: "column", md: "row" }}
                gap={{ base: 2, md: 4 }}
                align={{ base: "stretch", md: "center" }}
            >
                <Box as="strong" mb={{ base: 2, md: 0 }}>
                    {t("filter.state")} :
                </Box>
                <RadioGroup.Root
                    value={filterState.bookState}
                    onValueChange={handleStateChange}
                >
                    <Stack
                        direction={{ base: "column", md: "row" }}
                        gap={{ base: 2, md: 6 }}
                    >
                        {BOOK_STATES.map((state) => (
                            <RadioGroup.Item key={state} value={state} colorScheme="blue">
                                <RadioGroup.ItemHiddenInput />
                                <RadioGroup.ItemIndicator
                                    borderColor={tokens.colors.primary}
                                />
                                <RadioGroup.ItemText>
                                    {t(`filter.${state}`)}
                                </RadioGroup.ItemText>
                            </RadioGroup.Item>
                        ))}
                    </Stack>
                </RadioGroup.Root>
            </Stack>
        </Box>
    );
};