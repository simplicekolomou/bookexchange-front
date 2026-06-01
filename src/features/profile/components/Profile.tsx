import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import { ProfileHeader } from './ProfileHeaderProps.tsx'
import { ProfileTabs } from './ProfileTabs.tsx';
import { ProfileContent } from './ProfileContent.tsx';
import {useGetUserQuery} from "../api/profileApi.ts";

export const Profile = () => {
    const [activeTab, setActiveTab] = useState('collection');
    const navigate = useNavigate();

    //const loggedUser = JSON.parse(localStorage.getItem("auth_user")!);
    const params = useParams<{ userId?: string }>();
    console.log("Le params est :", params);
    const userId = params.userId ?? "";
    const { data: user } = useGetUserQuery({ userId });

    const handleBack = () => {
        navigate(-1);
    };

    const handleMessage = () => {
        // Logique pour envoyer un message
        console.log('Envoyer un message à');
    };
    return (
        <>
            <Box minH="100vh" bg="bg.canvas">
                <Container maxW="6xl" py={8} bg="bg.surface" borderRadius="md" borderWidth="1px" borderColor="border.default">
                    <ProfileHeader
                        isOwnProfile={true}
                        onBack={handleBack}
                        onMessage={handleMessage}
                        user={user}
                    />

                    <ProfileTabs
                        value={activeTab}
                        onChange={setActiveTab}
                    />

                    <ProfileContent
                        activeTab={activeTab}
                        books={[]}
                        wishlist={[]}
                        exchange={[]}
                        rating={[]}
                    />
                </Container>
            </Box>
        </>
    );
};
