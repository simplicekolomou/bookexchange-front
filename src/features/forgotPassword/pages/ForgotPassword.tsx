import { tokens } from "../../../theme/theme.ts";
import { Box, Flex } from "@chakra-ui/react";
import {ForgotPasswordForm} from "../components/ForgotPasswordForm.tsx";

export default function ForgotPassword() {
    return (
        <Box minH="100vh" bg={tokens.colors.background} py={tokens.spacing.md}>
            <Flex justify="center" align="center">
                <Box
                    w={{ base: "100%", md: "70%" }}
                    p={tokens.spacing.lg}
                    borderRadius={tokens.radius.xl}
                    bg={tokens.colors.surface}
                >
                    <ForgotPasswordForm />
                </Box>
            </Flex>
        </Box>
    );
}