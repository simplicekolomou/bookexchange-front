import {useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentUserId} from "../../authSlice.ts";
import {useGetUserQuery} from "../../api/authApi.ts";
import {skipToken} from "@reduxjs/toolkit/query/react";

export const useProfileController = (averageRating: number = 3) => {
    const [activeTab, setActiveTab] = useState('collection');
    const navigate = useNavigate();
    const userId = useSelector(selectCurrentUserId);
    const { data: user } = useGetUserQuery(userId ? { userId } : skipToken);

    const handleBack = () => {
        navigate(-1);
    };

    const handleMessage = () => {
        // Logique pour envoyer un message
        console.log('Envoyer un message à');
    };

    // Calcul des initiales pour le fallback de l'avatar
    const initials = useMemo(() => {
        const first = user?.firstName?.charAt(0) || '';
        const last = user?.lastName?.charAt(0) || '';
        return `${first}${last}`.toUpperCase();
    }, [user?.firstName, user?.lastName]);

    // Calcul des étoiles
    const starRating = useMemo(() => {
        const rounded = Math.round(Number(averageRating));
        return Math.max(0, Math.min(5, rounded));
    }, [averageRating]);

    return {
        activeTab,
        setActiveTab,
        handleBack,
        handleMessage,
        user,
        initials,
        starRating,
    };
}