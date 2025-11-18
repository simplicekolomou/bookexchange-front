import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks'
import type {JSX} from "react";

interface Props {
    children: JSX.Element
}

export const ProtectedRoute = ({ children }: Props) => {
    const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated)

    if (!isAuthenticated) {
        // redirige vers /login et conserve l'origine dans state
        return <Navigate to="/login" />
    }

    return children
}