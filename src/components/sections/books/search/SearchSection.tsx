import { Box, Container } from '@chakra-ui/react';
import {SearchBar} from "./SearchBar.tsx";

export const SearchSection = () => {
    return (
        <Box minH="100vh">
            <Container maxW="4xl" py={8}>
                <SearchBar />
            </Container>
        </Box>
    );
}