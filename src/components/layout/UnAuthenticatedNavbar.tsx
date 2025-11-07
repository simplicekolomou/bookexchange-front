import {Box, Button, Flex} from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import {RiArrowRightLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const UnAuthenticatedNavbar = () => {
    const {t} = useTranslation("common");
    return (
        <Box as="header">
            <div>
                <Flex className="unauthenticated-navbar-content">
                    <LogoWithText title={t("brand.title")} direction={"row"}/>
                    <Link to="/Login">
                        <Button size="md" variant="outline">
                            {t("actions.start")} <RiArrowRightLine />
                        </Button>
                    </Link>
                </Flex>
            </div>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};