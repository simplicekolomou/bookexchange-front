import {Box, Button, Flex} from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import {RiArrowRightLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const NavbarUnAuthenticatedUser = () => {
    const {t} = useTranslation("common");
    return (
        <Box as="header" className="navbar">
            <Box>
                <Flex className="navbar-content">
                    <LogoWithText title={t("brand.title")} direction={"row"}/>
                    <Flex align="center" gap="2">
                        <Link to="/Login">
                            <Button size="md" variant="outline">
                                {t("actions.start")} <RiArrowRightLine />
                            </Button>
                        </Link>
                    </Flex>
                </Flex>
            </Box>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};