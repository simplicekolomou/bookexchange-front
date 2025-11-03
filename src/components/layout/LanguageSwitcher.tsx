import { Button, ButtonGroup } from "@chakra-ui/react";
import i18n from "../../i18n";

export function LanguageSwitcher() {
    return (
        <ButtonGroup size="sm" variant="ghost">
            <Button onClick={() => i18n.changeLanguage("en")}>EN</Button>
            <Button onClick={() => i18n.changeLanguage("fr")}>FR</Button>
        </ButtonGroup>
    );
}