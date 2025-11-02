import {Box, Button, Flex} from "@chakra-ui/react";
import { LogoWithText } from "./LogoWithText.tsx";
import { UserMenu } from "./UserMenu.tsx";
import {RiArrowRightLine} from "react-icons/ri";
import {Link} from "react-router-dom";
import {SearchBar} from "./SearchBar.tsx";

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
                        <SearchBar />
                        <Link to="/login">
                            <Button size="md" variant="outline">
                                Commencer <RiArrowRightLine />
                            </Button>
                        </Link>
                        <div className="avatar">
                            {isAuthenticated && <UserMenu />}
                        </div>
                    </Flex>
                </Flex>
            </Box>
            <Box as="div" className="navbar-divider" />
        </Box>
    );
};