import {Navigate, Outlet} from 'react-router-dom'
import {useSelector} from "react-redux";
import {selectIsAuthenticated} from "../features/auth/authSlice.ts";

export const ProtectedRoute = () => {
    const isAuthenticated = useSelector(selectIsAuthenticated);
    console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}