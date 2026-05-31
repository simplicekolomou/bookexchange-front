import { useLocation, useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import { useTranslation } from "react-i18next";
import {Button, Flex} from "@chakra-ui/react";
import {tokens} from "../ui/theme.ts";

export const DoubleButton = () => {
    const [activeButton, setActiveButton] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();
    const { t } = useTranslation("auth");

    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };

    // Met à jour l'état selon l'URL actuelle (sans dépendance sur activeButton)
    useEffect(() => {
        if (location.pathname === "/LoginForm") {
            setActiveButton("login");
        } else if (location.pathname === "/RegisterForm") {
            setActiveButton("register");
        }
    }, [location.pathname]); // ← ne dépend que de l'URL

    return (
        <Flex
            mb={tokens.spacing.md}
            gap={tokens.spacing.xl}
            justify="center"
        >
            <Button
                variant={activeButton === "login" ? "solid" : "outline"}
                className={`btn ${activeButton === "login" ? "" : "inactive"}`}
                onClick={() => goto("/Login", "login")}
            >
                {t("login.action")}
            </Button>
            <Button
                variant={activeButton === "register" ? "solid" : "outline"}
                className={`btn ${activeButton === "register" ? "" : "inactive"}`}
                onClick={() => goto("/Register", "register")}
            >
                {t("forgotPassword.action")}
            </Button>
        </Flex>
    )
}