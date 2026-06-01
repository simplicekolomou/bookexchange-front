import { useNavigate } from "react-router-dom";
import {useState} from "react";
import { useTranslation } from "react-i18next";
import {Button, Flex} from "@chakra-ui/react";
import {tokens} from "../ui/theme.ts";

export const DoubleButton = () => {
    const pathName = window.location.pathname.toLowerCase();
    const [activeButton, setActiveButton] = useState(pathName);
    const navigate = useNavigate();
    const { t } = useTranslation("auth");

    const goto = (link: string,) => {
        navigate(link);
    };

    const variantLogin = activeButton.includes("login") ? "solid" : "outline";
    const variantRegister = activeButton.includes("register") ? "solid" : "outline";

    return (
        <Flex
            mb={tokens.spacing.md}
            gap={tokens.spacing.xl}
            justify="center"
        >
            <Button
                variant={variantLogin}
                onClick={() => {
                        goto("/Login");
                        setActiveButton("login");
                    }
                }
                width="40%"
            >
                {t("login.action")}
            </Button>
            <Button
                variant={variantRegister}
                onClick={() => {
                        goto("/Register");
                        setActiveButton("register");
                    }
                }
                width="40%"
            >
                {t("registration.action")}
            </Button>
        </Flex>
    )
}