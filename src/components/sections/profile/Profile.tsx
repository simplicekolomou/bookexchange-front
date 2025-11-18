import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@chakra-ui/react';
import type { BookApi, WishlistItem } from '../../../types/bookApi.ts';
import { ProfileHeader } from './ProfileHeaderProps'
import { ProfileTabs } from './ProfileTabs';
import { ProfileContent } from './ProfileContent';
import { BlockDialog } from './BlockDialog';


interface ProfileProps {
    isOwnProfile?: boolean;
    books?: BookApi[];
    wishlist?: WishlistItem[];
}

export const Profile = ({
                            isOwnProfile = false,
                            books = [],
                            wishlist = [],
                        }: ProfileProps) => {
    const [activeTab, setActiveTab] = useState('collection');
    const [isBlocked, setIsBlocked] = useState(false);
    const [showBlockDialog, setShowBlockDialog] = useState(false);
    const navigate = useNavigate();

    /*const calculateAverageRating = () => {
        if (ratings.length === 0) return '0.0';
        const sum = ratings.reduce((acc, r) => acc + r.stars, 0);
        return (sum / ratings.length).toFixed(1);
    };*/

    const handleBack = () => {
        navigate(-1);
    };

    const handleMessage = () => {
        // Logique pour envoyer un message
        console.log('Envoyer un message à');
    };

    const handleBlock = () => {
        setIsBlocked(!isBlocked);
        setShowBlockDialog(false);
    };

    return (
        <>
            <Box minH="100vh">
                <Container maxW="6xl" py={8}>
                    <ProfileHeader
                        isOwnProfile={isOwnProfile}
                        isBlocked={isBlocked}
                        onBack={handleBack}
                        onMessage={handleMessage}
                        onBlock={handleBlock}
                        onShowBlockDialog={() => setShowBlockDialog(true)}
                    />

                    <ProfileTabs
                        value={activeTab}
                        onChange={setActiveTab}
                    />

                    <ProfileContent
                        activeTab={activeTab}
                        books={books}
                        wishlist={wishlist}
                    />
                </Container>

                <BlockDialog
                    isOpen={showBlockDialog}
                    onClose={() => setShowBlockDialog(false)}
                    onConfirm={handleBlock}
                    isBlocked={isBlocked}
                />
            </Box>
        </>
    );
};