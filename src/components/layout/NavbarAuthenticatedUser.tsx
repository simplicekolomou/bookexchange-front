import {Box, Button, Flex} from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import {SearchBar} from "./SearchBar.tsx";
import {Plus} from "lucide-react";
import {useTranslation} from "react-i18next";


export const NavbarAuthenticatedUser = () => {
    const {t} = useTranslation("common");
    return (
        <Box as="header" className="navbar">
            <Box>
                <Flex className="navbar-content">
                    <LogoWithText title={t("brand.title")} direction={"row"}/>
                    <Flex align="center" gap="2">
                        <SearchBar />
                        <Button size="md" variant="outline">
                            {t("actions.add")}<Plus />
                        </Button>
                        <UserMenu />
                    </Flex>
                </Flex>
            </Box>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};