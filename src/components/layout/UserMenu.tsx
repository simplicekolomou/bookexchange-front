import { Avatar, Portal } from "@chakra-ui/react";
import { User, Settings } from "lucide-react";
import { Menu } from "@chakra-ui/react";

export const UserMenu = () => {
    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Avatar.Root>
                    <Avatar.Fallback name="Segun Adebayo" />
                    <Avatar.Image src="https://bit.ly/sage-adebayo" />
                </Avatar.Root>
            </Menu.Trigger>
            <Portal>
                <Menu.Positioner>
                    <Menu.Content>
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
            </Portal>
        </Menu.Root>
    );
};