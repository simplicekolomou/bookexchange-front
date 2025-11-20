import { Avatar } from "@chakra-ui/react";
import { User, Settings, LogOut } from "lucide-react";
import { Menu } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import {logout} from "../../features/auth/authSlice"

export const UserMenu = () => {
    const { t: tLocal } = useTranslation("userMenu");
    const dispatch = useAppDispatch();
    const { t: tGlobal } = useTranslation("common");
    const navigate = useNavigate();

    const handleLogout = async () => {
       dispatch(logout())
       navigate("/login")
    };

    return (
        <div>
            <Menu.Root>
                <Menu.Trigger className="navbar-avatar" as="div">
                    <Avatar.Root>
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                    </Avatar.Root>
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content className="user-menu-content">
                        <Menu.Item value="profile">
                            <Link to={"/profile"}>
                                <User className="user-menu-icon" />
                                {tLocal("profil")}
                            </Link>
                        </Menu.Item>

                        <Menu.Item value="settings">
                            <Link to={"/settings"}>
                                <Settings className="user-menu-icon" />
                                {tLocal("settings")}
                            </Link>
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item value="logout" className="user-menu-logout" onSelect={handleLogout}>
                            <LogOut />
                            {tGlobal("nav.logout")}
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
        </div>
    );
};