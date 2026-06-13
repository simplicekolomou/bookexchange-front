import { useSelector } from "react-redux"
import { selectCurrentUserId, selectIsAuthenticated } from "../features/auth/authSlice.ts"
import { Navigate, Outlet } from "react-router-dom"
import { useGetMeQuery } from "../features/auth/api/authApi.ts"
import { Spinner, Flex } from "@chakra-ui/react"

export const PublicOnlyRoute = () => {
    // même vérification — évite un flash de la page login si déjà connecté
    const { isLoading } = useGetMeQuery();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userId = useSelector(selectCurrentUserId);

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }

    return isAuthenticated
        ? <Navigate to={`/user/${userId}/collection`} replace />
        : <Outlet />;
};