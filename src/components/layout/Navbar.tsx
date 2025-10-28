import { Box, Flex } from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { GoButton } from "../boutons/Gobutton.tsx";
import { UserMenu } from "./UserMenu.tsx";
import { useNavigate } from "react-router-dom";

interface NavigationBarProps {
    title: string;
    subtitle?: string;
    isAuthenticated?: boolean;
}

export const Navbar = ({ title, subtitle, isAuthenticated }: NavigationBarProps) => {
    const navigate = useNavigate();
    const handleGoButtonClick = () => {
        navigate("/login");
    };
    return (
        <Box as="header" className="navbar">
            <Box>
                <Flex className="navbar-content">
                    <LogoWithText title={title} subtitle={subtitle}/>
                    <Flex align="center" gap="2">
                        <GoButton title="Commencer" onClick={handleGoButtonClick} />
                        {isAuthenticated && <UserMenu />}
                    </Flex>
                </Flex>
            </Box>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};