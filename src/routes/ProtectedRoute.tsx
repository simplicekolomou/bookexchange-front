import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux"
import { selectIsAuthenticated } from "../features/auth/authSlice.ts"
import { useGetMeQuery } from "../features/auth/api/authApi.ts"
import { Spinner, Flex } from "@chakra-ui/react"

export const ProtectedRoute = () => {
    // getMe hydrate le store au refresh — isLoading pendant la vérification
    const { isLoading } = useGetMeQuery();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // pendant la vérification du cookie → ne pas rediriger trop tôt
    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }
    return (isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />);
};