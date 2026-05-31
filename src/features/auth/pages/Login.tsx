import {tokens} from "../../../components/ui/theme.ts";
import {Box, Flex} from "@chakra-ui/react";
import LoginForm from "../components/LoginForm.tsx";

export default function Login(){
    return (
        <Box minH="100vh" bg={tokens.colors.background} py={tokens.spacing.md}>
            <Flex
                justify="center"
                align="center"
            >
                <Box
                    w={{ base: "100%", md: "70%" }}
                    p={tokens.spacing.lg}
                    borderRadius={tokens.radius.xl}
                    bg={tokens.colors.surface}
                >
                    <LoginForm />
                </Box>
            </Flex>
        </Box>
    );
}