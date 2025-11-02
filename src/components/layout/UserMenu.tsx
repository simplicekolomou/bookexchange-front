import { Avatar } from "@chakra-ui/react";
import { User, Settings } from "lucide-react";
import { Menu } from "@chakra-ui/react";

export const UserMenu = () => {
    return (
        <div className="user-menu">
            <Menu.Root>
                <Menu.Trigger>
                    <Avatar.Root>
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo" />
                    </Avatar.Root>
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content className="user-menu-content">
                        <Menu.Item value="profile">
                            <User className="user-menu-icon" />
                            Mon profil
                        </Menu.Item>
                        <Menu.Item value="settings">
                            <Settings className="user-menu-icon" />
                            Paramètres
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item value="logout">Déconnexion</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
        </div>
    );
};