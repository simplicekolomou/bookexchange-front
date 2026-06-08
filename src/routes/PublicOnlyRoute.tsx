import { useSelector } from "react-redux";
import {selectCurrentUserId, selectIsAuthenticated} from "../features/auth/authSlice.ts";
import {Navigate, Outlet} from "react-router-dom";

export const PublicOnlyRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const userId = useSelector(selectCurrentUserId);
    return isAuthenticated ? <Navigate to={`/user/${userId}/collection`} replace /> : <Outlet />;
}