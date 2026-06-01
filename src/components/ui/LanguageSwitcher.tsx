import { Button, ButtonGroup } from "@chakra-ui/react";
import i18n from "../../i18n";
import { tokens } from "../../theme/theme.ts";

export function LanguageSwitcher() {
    const current = i18n.language || "en";
    const change = (lng: string) => i18n.changeLanguage(lng);

    return (
        <ButtonGroup size="sm">
            <Button
                onClick={() => change("en")}
                aria-pressed={current === "en"}
                bg={current === "en" ? tokens.colors.primary : "transparent"}
                color={current === "en" ? "white" : tokens.colors.textMuted}
                _hover={{
                    bg: current === "en" ? tokens.colors.primaryHover : tokens.colors.surface,
                }}
                borderRadius={tokens.radius.md}
            >
                🇬🇧 - EN
            </Button>

            <Button
                onClick={() => change("fr")}
                aria-pressed={current === "fr"}
                bg={current === "fr" ? tokens.colors.primary : "transparent"}
                color={current === "fr" ? "white" : tokens.colors.textMuted}
                _hover={{
                    bg: current === "fr" ? tokens.colors.primaryHover : tokens.colors.surface,
                }}
                borderRadius={tokens.radius.md}
            >
                🇫🇷 - FR
            </Button>
        </ButtonGroup>
    );
}
