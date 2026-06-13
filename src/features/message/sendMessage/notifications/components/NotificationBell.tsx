import { Bell } from "lucide-react";
import { Box, Icon } from "@chakra-ui/react";
import {useNotification} from "../hook/useNotification.ts";

export const NotificationBell = () => {
    const { notifications, clearAll, notificationsCount } = useNotification();

    console.log("Notifications:", notifications); // ✅ log des notifications reçues

    return (
        <Box position="relative" cursor="pointer" onClick={clearAll}>
            <Icon as={Bell} boxSize={5} />
            {notificationsCount > 0 && (
                <Box
                    position="absolute"
                    top="-1"
                    right="-1"
                    bg="red.500"
                    color="white"
                    borderRadius="full"
                    fontSize="xs"
                    w={4}
                    h={4}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                >
                    {notificationsCount > 9 ? "9+" : notificationsCount}
                </Box>
            )}
        </Box>
    );
};