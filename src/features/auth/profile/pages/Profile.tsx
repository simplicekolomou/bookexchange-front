import { Box, Container } from '@chakra-ui/react';
import { ProfileHeader } from '../components/ProfileHeaderProps.tsx'
import { ProfileTabs } from '../components/ProfileTabs.tsx';
import { ProfileContent } from '../components/ProfileContent.tsx';
import {useProfileController} from "../hook/useProfileController.ts";
import {useGetMyBooksQuery, useGetMyWishListQuery} from "../../../book/api/bookApi.ts";

export const Profile = () => {
    const { activeTab, setActiveTab, handleBack, handleMessage, user } = useProfileController();
    const {data: books} = useGetMyBooksQuery();
    const {data: wishlist} = useGetMyWishListQuery();
    return (
        <>
            <Box
                minH="100vh"
                bg="bg.canvas"
                py={5}
            >
                <Container
                    maxW="6xl"
                    h="full"
                    py={2}
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
                        books={books}
                        wishlist={wishlist}
                        exchange={[]}
                        rating={[]}
                    />
                </Container>
            </Box>
        </>
    );
};
