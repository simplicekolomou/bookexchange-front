import { useSelector } from "react-redux";
import { selectCurrentUserId, selectIsAuthenticated, setCredentials } from "../features/auth/authSlice.ts";
import { Navigate, Outlet } from "react-router-dom";
import { useGetMeQuery } from "../features/auth/api/authApi.ts";
import { Spinner, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAppDispatch } from "../app/hooks.ts";

export const PublicOnlyRoute = () => {
    const dispatch = useAppDispatch();

    // On récupère "isSuccess" en plus de "data" et "isLoading", pour avoir une information
    // d'authentification disponible IMMÉDIATEMENT, sans attendre le
    // passage par Redux (qui prend un cycle de rendu supplémentaire).
    const { data, isLoading, isSuccess } = useGetMeQuery();

    // On dispatch setCretials pour mettre à jour le cache sinon
    // Redux "authSlice" ne serait jamais informé que l'utilisateur est
    // connecté — un bug qui pourrait bloquer l'utilisateur sur la page
    // de login indéfiniment après un rafraîchissement.
    useEffect(() => {
        if (data) {
            dispatch(setCredentials(data));
        }
    }, [data, dispatch]);

    const isAuthenticatedFromStore = useSelector(selectIsAuthenticated);
    const userId = useSelector(selectCurrentUserId);

    // On combine les deux sources pour éviter le décalage d'un cycle de rendu.
    const isAuthenticated = isAuthenticatedFromStore || isSuccess;

    if (isLoading) {
        return (
            <Flex justify="center" align="center" minH="100vh">
                <Spinner size="lg" color="colorPalette.default" />
            </Flex>
        );
    }

    // Si isSuccess vient tout juste de passer à true
    // (juste après le refresh), "userId" (venant de Redux, pas encore
    // à jour à ce moment précis) pourrait être undefined. On utilise
    // alors une valeur de secours depuis "data" directement (la réponse
    // de getMe elle-même), qui EST disponible immédiatement.
    const resolvedUserId = userId ?? data?.id;

    return isAuthenticated
        ? <Navigate to={`/user/${resolvedUserId}/collection`} replace />
        : <Outlet />;
};