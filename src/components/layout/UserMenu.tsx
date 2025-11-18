import { Avatar } from "@chakra-ui/react";
import { User, Settings, LogOut } from "lucide-react";
import { Menu } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";

export const UserMenu = () => {
    const { t: tLocal } = useTranslation("userMenu");
    const { t: tGlobal } = useTranslation("common");
    const { logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed:", err);
        }
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
                                {tLocal("profile")}
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