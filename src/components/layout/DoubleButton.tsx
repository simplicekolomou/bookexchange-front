import {tokens} from "../ui/theme.ts";
import {Button, Flex} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

export const DoubleButton = () => {
    const [activeButton, setActiveButton] = useState('login');
    const navigate = useNavigate();
    const { t } = useTranslation("auth");
    const goto = (link: string, button: string) => {
        setActiveButton(button);
        navigate(link);
    };

    useEffect(() => {
        if(window.location.pathname === "/LoginForm") {
            setActiveButton("login");
        } else if(window.location.pathname === "/Registration") {
            setActiveButton("register");
        }
    }, [activeButton]);
    return (
        <Flex
            mb={tokens.spacing.md}
            gap={tokens.spacing.xl}
            justify="center"
        >
            <Button
                variant={activeButton === "login" ? "solid" : "outline"}
                className={`btn ${activeButton === "login" ? "" : "inactive"}`}
                onClick={() => goto("../../features/auth/components/LoginForm", "login")}
            >
                {t("login.action")}
            </Button>
            <Button
                variant={activeButton === "register" ? "solid" : "outline"}
                className={`btn ${activeButton === "register" ? "" : "inactive"}`}
                onClick={() => goto("/Registration", "register")}
            >
                {t("forgotPassword.action")}
            </Button>
        </Flex>
    )
}