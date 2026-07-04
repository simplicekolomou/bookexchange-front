import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from "react-redux";
import { selectIsAuthenticated, setCredentials } from "../features/auth/authSlice.ts";
import { useGetMeQuery } from "../features/auth/api/authApi.ts";
import { Spinner, Flex } from "@chakra-ui/react";
import FirebaseInitializer from "./FirebaseIntializer.tsx";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks.ts";

export const ProtectedRoute = () => {
    const dispatch = useAppDispatch();

    // "isSuccess" est un booléen fourni par RTK Query, mis à jour EN MÊME
    // TEMPS que "data" et "isLoading" — donc il vaut "true" dès que la requête a réussi, dans le
    // MÊME rendu où "isLoading" passe à false.
    const { data, isLoading, isSuccess, isUninitialized } = useGetMeQuery();

    // Il sert à remplir le slice Redux "authSlice", utile pour TOUT LE RESTE de l'app (navbar, autres
    // composants qui lisent "selectIsAuthenticated" ou les infos user).
    useEffect(() => {
        if (data) {
            dispatch(setCredentials(data));
        }
    }, [data, dispatch]);

    // On lit le Redux store, car une fois que l'utilisateur
    // a navigué une première fois dans l'app (pas au tout premier chargement),
    // ce sera la source la plus à jour (par exemple après un login classique,
    // qui dispatch directement setCredentials sans passer par cette route).
    const isAuthenticatedFromStore = useSelector(selectIsAuthenticated);

    // On combine les deux sources avec un OU (||).
    // - "isAuthenticatedFromStore" couvre le cas où Redux est déjà à jour
    //   (par exemple après un login classique, ou lors d'une navigation
    //   normale dans l'app, sans rechargement de page)
    // - "isSuccess" couvre le cas du TOUT PREMIER rendu après un
    //   rafraîchissement de page, où Redux n'a pas encore eu le temps
    //   d'être mis à jour par le useEffect, mais où la query elle-même
    //   sait DÉJÀ que la requête a réussi.
    //
    // Grâce à ce OU, dès que l'UNE des deux sources dit "authentifié",
    // on considère l'utilisateur comme connecté.
    const isAuthenticated = isAuthenticatedFromStore || isSuccess;

    if (isLoading || isUninitialized) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }

    return isAuthenticated ? (
        <>
            <FirebaseInitializer />
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};