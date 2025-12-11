import {Box, Button, Center} from "@chakra-ui/react";
import {Container} from "@chakra-ui/react";
import {useState} from "react";
import {useTranslation} from "react-i18next";
import {subscribeToPush} from "../../services/notification.ts"

export const Message = () => {
    const show = 'Notification' in window
    const [open, setOpen] = useState(true)
    const {t} = useTranslation("notification");
    return (
        <Box minH="80vh" bg="bg.canvas">
            <Container maxW="6xl" px={4} py={8}>
                <Center>
                    <h4>TODO page messages</h4>
                </Center>
                <Button
                   visibility={show && open ? 'visible' : 'hidden'}
                   onClick={() => {
                       setOpen(!open)
                       subscribeToPush().then(res => console.log(res))
                   }}>
                    {t("notification:question")}
                </Button>
            </Container>
        </Box>
    )
}