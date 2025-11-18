import React from 'react'
import {
    Box,
    Container,
    VStack,
    Text,
    Flex
} from '@chakra-ui/react'
import {Link} from 'react-router-dom'
import { useColorModeValue } from '../ui/color-mode'
import {CiWarning} from "react-icons/ci";

export const NotFound404: React.FC = () => {
    const textColor = useColorModeValue('gray.600', 'gray.300')

    return (
        <Box
            minH="25vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            py={10}
            bg={"gray.50"}
        >
            <Container maxW="container.md">
                <VStack gap={8} textAlign="center">

                    {/* Contenu */}
                    <VStack gap={6}>

                        <Text fontSize="xl" color={textColor} maxW="md">
                            La page que vous cherchez semble avoir été empruntée par quelqu'un d'autre.
                            Peut-être est-elle en cours d'échange ?
                        </Text>

                        <Text fontSize="md" color="gray.500" fontStyle="italic" display="flex" alignItems="center" gap={2}>
                            <CiWarning />
                            Erreur 404 - Page introuvable
                        </Text>
                    </VStack>

                    {/* Actions */}
                    <Flex
                        direction={{ base: 'column', md: 'row' }}
                        gap={4}
                        mt={8}
                    >
                        <Link to="/">
                            Page d'accueil
                        </Link>
                    </Flex>
                </VStack>
            </Container>
        </Box>
    )
}