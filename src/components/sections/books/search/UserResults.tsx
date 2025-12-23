import {Box, SimpleGrid, Text, useBreakpointValue, } from '@chakra-ui/react';
import { Users } from 'lucide-react';
import {UserCard} from "../../../layout/UserCard.tsx";
import type {UserProfile} from "../../../../types/profile.types.ts";

interface UserResultsProps {
    users: UserProfile[];
}

export const UserResults = ({users}: UserResultsProps) => {
    const gridColumns = useBreakpointValue({
        base: 1,
        sm: 2,
        md: 3,
        lg: 4
    });
    if (users.length === 0) {
        return (
            <Box textAlign="center" py={12}>
                <Users size={64} color="var(--chakra-colors-gray-400)" style={{ margin: '0 auto 16px' }} />
                <Text color="gray.500">Aucun utilisateur trouvé</Text>
            </Box>
        );
    }

    return (
            <SimpleGrid
                columns={gridColumns}
                gap={4}
                w="full"
            >
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                    />
                ))}
            </SimpleGrid>
    )
};