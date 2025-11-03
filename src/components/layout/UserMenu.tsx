import { Avatar } from "@chakra-ui/react";
import { User, Settings } from "lucide-react";
import { Menu } from "@chakra-ui/react";
import {useTranslation} from "react-i18next";

export const UserMenu = () => {
    const {t : tLocal} = useTranslation("userMenu");
    const {t : tGlobal} = useTranslation("common");
    return (
        <div>
            <Menu.Root>
                <Menu.Trigger className="navbar-avatar" as="div">
                    <Avatar.Root >
                        <Avatar.Fallback name="Segun Adebayo" />
                        <Avatar.Image src="https://bit.ly/sage-adebayo"/>
                    </Avatar.Root>
                </Menu.Trigger>
                <Menu.Positioner>
                    <Menu.Content className="user-menu-content">
                        <Menu.Item value="profile">
                            <User className="user-menu-icon" />
                            {tLocal("profil")}
                        </Menu.Item>
                        <Menu.Item value="settings">
                            <Settings className="user-menu-icon" />
                            {tLocal("settings")}
                        </Menu.Item>
                        <Menu.Separator />
                        <Menu.Item value="logout">{tGlobal("nav.logout")}</Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
        </div>
    );
};