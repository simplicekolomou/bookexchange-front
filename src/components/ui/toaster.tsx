"use client"

import {
    Toaster as ChakraToaster,
    Portal,
    Spinner,
    Stack,
    Toast,
    Button,
} from "@chakra-ui/react"
import {toaster} from "../toaster/toasterInstance.tsx";

/**
 * Dans Chakra UI V3, le système de toaster est devenu completement paramétrable et c'est ici que cela est donc géré.
 */
export const Toaster = () => {
    const toastColors = {
        success: "green.500",
        error: "red.500",
        warning: "yellow.500",
        info: "gray.200",
        loading: "gray.400",
    } as const;

    type ToastType = keyof typeof toastColors;

    return (
        <Portal>
            <ChakraToaster toaster={toaster} insetInline={{mdDown: "4"}}>
                {(toast) => (
                    <Toast.Root
                        width={{md: "sm"}}
                        bg="white"
                        color="gray.800"
                        border="2px solid"
                        borderColor={toastColors[toast.type as ToastType] ?? "gray.300"}
                        borderRadius="md"
                        shadow="md"
                        display="flex"
                        direction="row"
                    >
                        {toast.type === "loading" ? (
                            <Spinner size="sm" color="blue.solid"/>
                        ) : (
                            <Toast.Indicator/>
                        )}
                        <Stack gap="1" flex="1" maxWidth="100%">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        {toast.action && (
                            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
                        )}
                        {toast.closable &&
                            <Toast.CloseTrigger asChild>
                                <Button
                                    variant="ghost"
                                    p="0"
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="center"
                                    fontSize="lg"
                                    m="auto"
                                >
                                    ✕
                                </Button>
                            </Toast.CloseTrigger>
                        }
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    )
}
