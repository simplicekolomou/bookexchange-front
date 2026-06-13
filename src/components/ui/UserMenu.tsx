import {
    Avatar, Menu, Box, Text, Icon, SkeletonCircle,
} from "@chakra-ui/react";
import { User, Settings, LogOut } from "lucide-react";
import { GrUpdate } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks.ts";
import {
    logout,
    selectCurrentUser,
    selectUserPicture,
} from "../../features/auth/authSlice.ts";
import {useGetProfilePictureQuery, useLogoutMutation} from "../../features/auth/api/authApi.ts";
import { persistor } from "../../app/store.ts";
import { useSelector } from "react-redux";
import { baseApi } from "../../services/baseApi.ts";

export const UserMenu = () => {
    const { t } = useTranslation("userMenu");
    const { t: tGlobal } = useTranslation("common");
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [logoutMutation] = useLogoutMutation();
    // User depuis authSlice
    const user = useSelector(selectCurrentUser);
    const hasProfilePicture = useSelector(selectUserPicture); // extension ou null

    const { data: profilePictureUrl, isLoading: isPictureLoading } =
        useGetProfilePictureQuery(undefined, {
            skip: !hasProfilePicture, // skip si pas de photo
        });

    const handleLogout = async () => {
        try {
            await logoutMutation().unwrap(); // efface le cookie httpOnly côté serveur
        } catch {
            // Même si le serveur échoue, on nettoie le state local
        } finally {
            dispatch(logout());
            dispatch(baseApi.util.resetApiState());   // vide le cache RTK Query
            await persistor.purge();                  // vide le localStorage persist
            navigate("/login");
        }
    };

    const getInitials = () => {
        const first = user?.firstName?.charAt(0) ?? "";
        const last = user?.lastName?.charAt(0) ?? "";
        return `${first}${last}`.toUpperCase();
    };

    return (
        <Menu.Root>
            <Menu.Trigger asChild>
                <Box
                    cursor="pointer"
                    transition="transform 0.2s"
                    _hover={{ transform: "scale(1.05)" }}
                >
                    <Avatar.Root size="md">
                        <Avatar.Fallback
                            bg="colorPalette.default"
                            color="white"
                            fontWeight="bold"
                        >
                            {getInitials()}
                        </Avatar.Fallback>
                        {isPictureLoading ? (
                            <SkeletonCircle size="10" />
                        ) : (
                            <Avatar.Image src={profilePictureUrl ?? undefined} />
                        )}
                    </Avatar.Root>
                </Box>
            </Menu.Trigger>

            <Menu.Positioner>
                <Menu.Content
                    bg="white"
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    boxShadow="xl"
                    minW="220px"
                    py={2}
                    overflow="hidden"
                    _dark={{ bg: "gray.800", borderColor: "gray.700" }}
                >
                    {/* En-tête utilisateur */}
                    <Box
                        px={3} py={2}
                        borderBottomWidth="1px"
                        borderColor="gray.100"
                        _dark={{ borderColor: "gray.700" }}
                    >
                        <Text fontWeight="bold" fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }}>
                            {user?.firstName} {user?.lastName}
                        </Text>
                        <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                            {user?.email}
                        </Text>
                    </Box>

                    {[
                        { value: "profile", to: `/user/${user?.id}/profile`, icon: User, label: t("profile") },
                        { value: "settings", to: "/settings", icon: Settings, label: t("settings") },
                        { value: "updatePassword", to: "/update-password", icon: GrUpdate, label: t("updatePassword") },
                    ].map(({ value, to, icon, label }) => (
                        <Menu.Item key={value} value={value} p={0} _hover={{ bg: "transparent" }}>
                            <Link
                                to={to}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "10px 12px",
                                    width: "100%",
                                    textDecoration: "none",
                                    color: "inherit",
                                }}
                            >
                                <Icon as={icon} boxSize={4} />
                                <Text fontSize="sm">{label}</Text>
                            </Link>
                        </Menu.Item>
                    ))}

                    <Menu.Separator
                        borderColor="gray.100"
                        _dark={{ borderColor: "gray.700" }}
                        my={1}
                    />

                    <Menu.Item
                        value="logout"
                        onSelect={handleLogout}
                        gap={3}
                        py={2.5}
                        px={3}
                        color="red.600"
                        _hover={{
                            bg: "red.50",
                            color: "red.700",
                            _dark: { bg: "red.900", color: "red.300" },
                        }}
                        transition="background 0.2s"
                    >
                        <Icon as={LogOut} boxSize={4} />
                        <Text fontSize="sm">{tGlobal("nav.logout")}</Text>
                    </Menu.Item>
                </Menu.Content>
            </Menu.Positioner>
        </Menu.Root>
    );
};