import { useEffect } from 'react';
import {useGetProfilePictureQuery} from "../profileApi.ts";

export const useProfilePicture = () => {
    const { data: profilePictureUrl, refetch, error } = useGetProfilePictureQuery();

    // Nettoyer l'URL blob lorsque le composant est démonté ou lorsque l'URL change
    useEffect(() => {
        return () => {
            if (profilePictureUrl && profilePictureUrl.startsWith('blob:')) {
                URL.revokeObjectURL(profilePictureUrl);
            }
        };
    }, [profilePictureUrl]);

    return {
        profilePictureUrl: profilePictureUrl || null,
        refetch,
        error,
    };
};