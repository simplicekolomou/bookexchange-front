import { Box, Container } from '@chakra-ui/react';
import { ProfileHeader } from '../components/ProfileHeaderProps.tsx'
import { ProfileTabs } from '../components/ProfileTabs.tsx';
import { ProfileContent } from '../components/ProfileContent.tsx';
import {useProfileController} from "../hook/useProfileController.ts";

export const Profile = () => {
    const { activeTab, setActiveTab, handleBack, handleMessage, user } = useProfileController();
    // TODO - Fetch les données de l'utilisateur et les passer aux composants enfants
    return (
        <>
            <Box
                minH="100vh"
                bg="bg.canvas"
                py={5}
            >
                <Container
                    maxW="6xl"
                    py={8}
                    bg="bg.surface"
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor="border.default"
                >
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
