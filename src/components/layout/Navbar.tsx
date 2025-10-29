import {Box, Button, Flex} from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import {RiArrowRightLine} from "react-icons/ri";
import {Link} from "react-router-dom";

interface NavigationBarProps {
    title: string;
    isAuthenticated?: boolean;
}

export const Navbar = ({ title, isAuthenticated }: NavigationBarProps) => {
    return (
        <Box as="header" className="navbar">
            <Box>
                <Flex className="navbar-content">
                    <LogoWithText title={title} direction={"row"}/>
                    <Flex align="center" gap="2">
                        <Link to="/login">
                            <Button size="md" colorPalette="teal" variant="outline">
                                Commencer <RiArrowRightLine />
                            </Button>
                        </Link>
                        {isAuthenticated && <UserMenu />}
                    </Flex>
                </Flex>
            </Box>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};