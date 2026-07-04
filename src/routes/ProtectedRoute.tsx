import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from "react-redux"
import {selectIsAuthenticated, setCredentials} from "../features/auth/authSlice.ts"
import { useGetMeQuery } from "../features/auth/api/authApi.ts"
import { Spinner, Flex } from "@chakra-ui/react"
import FirebaseInitializer from "./FirebaseIntializer.tsx";
import {useEffect} from "react";
import {useAppDispatch} from "../app/hooks.ts";

export const ProtectedRoute = () => {
    const dispatch = useAppDispatch();
    // getMe hydrate le store au refresh — isLoading pendant la vérification
    const { data, isLoading } = useGetMeQuery();

    useEffect(() => {
        if (data) {
            // On remplit le slice Redux "user" avec les infos retrouvées,
            // exactement comme le ferait login/register — sauf qu'ici,
            // c'est déclenché automatiquement au démarrage, pas par un clic.
            dispatch(setCredentials(data));
        }
    }, [data, dispatch]);

    const isAuthenticated = useSelector(selectIsAuthenticated);

    // pendant la vérification du cookie → ne pas rediriger trop tôt
    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }
    return (isAuthenticated ?
            (
                <>
                    <FirebaseInitializer />
                    <Outlet />
                </>
            ) :
            (
                <Navigate to="/login" replace />
            )
    );
};