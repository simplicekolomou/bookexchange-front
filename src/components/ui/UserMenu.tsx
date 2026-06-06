import { Avatar, Menu, Box, HStack, Text } from "@chakra-ui/react";
import { User, Settings, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks.ts";
import {logout, selectCurrentUser} from "../../features/auth/authSlice.ts";
import { useProfilePicture } from "../../features/profile/hook/useProfilePicture.ts";
import {GrUpdate} from "react-icons/gr";
import {persistor} from "../../app/store.ts";
import {useSelector} from "react-redux";


export const UserMenu = () => {
    const { t } = useTranslation("userMenu");
    const dispatch = useAppDispatch();
    const { t: tGlobal } = useTranslation("common");
    const navigate = useNavigate();
    const { profilePictureUrl } = useProfilePicture();
    const imageSrc = profilePictureUrl;
    const user = useSelector(selectCurrentUser);

    const handleLogout = async () => {
        dispatch(logout())              // reset du state Redux + resetApiState (dans le slice)
        await persistor.purge()         // vide le localStorage redux-persist
        navigate("/login")              // navigation après purge effective
    }

    return (
        <Box>
            <Menu.Root>
                <Menu.Trigger className="navbar-avatar" as="div">
                    <Avatar.Root>
                        <Avatar.Fallback bg="colorPalette.default" color="white" name="Segun Adebayo" />
                        <Avatar.Image src={imageSrc!} />
                    </Avatar.Root>
                </Menu.Trigger>

                <Menu.Positioner>
                    <Menu.Content
                        bg="bg.surface"
                        borderWidth="1px"
                        borderColor="border.default"
                        color="fg.default"
                        borderRadius="md"
                        minW="30px"
                    >
                        <Menu.Item value="profile" _hover={{ bg: "bg.subtle" }}>
                            <Link
                                to={`/user/${user?.id}/profile`}
                                className="link"
                            >
                                <User size={16} color="currentColor" />
                                <Text as="span" color="fg.default">
                                    {t("profile")}
                                </Text>
                            </Link>
                        </Menu.Item>

                        <Menu.Item value="settings" _hover={{ bg: "bg.subtle" }}>
                            <Link
                                to={"/settings"}
                                className="link"
                            >
                                <Settings size={16} color="currentColor" />
                                <Text as="span" color="fg.default">
                                    {t("settings")}
                                </Text>
                            </Link>
                        </Menu.Item>
                        <Menu.Item value="updatePassword" _hover={{ bg: "bg.subtle" }}>
                            <Link
                                to={"/update-password"}
                                className="link"
                            >
                                <GrUpdate size={16} color="currentColor" />
                                <Text as="span" color="fg.default">
                                    {t("updatePassword")}
                                </Text>
                            </Link>
                        </Menu.Item>

                        <Menu.Separator borderColor="border.muted" my={1} />

                        <Menu.Item
                            value="logout"
                            className="user-menu-logout"
                            onSelect={handleLogout}
                            _hover={{ bg: "bg.subtle" }}
                        >
                            <HStack as="span" gap={2} color="fg.default">
                                <LogOut size={16} color="currentColor" />
                                <Text as="span" color="fg.default">
                                    {tGlobal("nav.logout")}
                                </Text>
                            </HStack>
                        </Menu.Item>
                    </Menu.Content>
                </Menu.Positioner>
            </Menu.Root>
        </Box>
    );
};
