import {
    Card,
    Flex,
    Image,
    LinkBox,
    LinkOverlay,
    IconButton,
    Heading,
    Badge,
    Text
} from "@chakra-ui/react";
import {Link as RouterLink, useNavigate} from "react-router-dom";
import {SendHorizonalIcon} from "lucide-react";
import type {UserProfile} from "../../types/profile.types.ts";
import {useTranslation} from "react-i18next";

interface UserCardProps {
    user: UserProfile
}
export const UserCard = ({user}: UserCardProps) => {
    const {t} = useTranslation("profile");
    const navigate = useNavigate();

    function handleSendMessage(idUser: string) {
        // navigue vers la page de messaging en précisant l'utilisateur ciblé
        // et transmet l'ID dans l'état pour que ChatBox puisse ouvrir la conversation
        // et envoyer un message automatiquement si nécessaire.
        navigate(`/send-message?user=${encodeURIComponent(idUser)}`, { state: { recipientId: idUser, sendNow: true } });
    }

    if(user){
        return (
            <LinkBox as={Card.Root} overflow="hidden" borderRadius="lg" shadow="sm" bg="white" h="100%" w="3xs">
                {/*@ts-expect-error Chakra LinkOverlay does not support "to" in TS*/}
                <LinkOverlay as={RouterLink} to={`/user/${user.id}/profile`}/>
                <Image
                    src={user.profilePicture}
                    alt={user.firstName}
                    objectFit="cover"
                    w="full"
                    h="44"
                    borderRadius="md"
                />

                <Card.Body p={4} display="flex" flexDirection="column" flex="1">
                    <Flex direction="column" gap={2} flex="1">
                        <Heading size="sm">{user.firstName} {user.lastName}</Heading>
                        <Text>{user.bio}</Text>

                        <hr/>

                        <Flex direction="column" mt="auto">
                            <Flex direction="row" gap={2}>
                                {user.adress?.locality && (
                                    <Badge
                                        mt={1}
                                        w="fit-content"
                                        variant="subtle"
                                        fontSize="80%"
                                        fontStyle="italic"
                                        border="1px Solid"
                                        borderColor="accent.600"
                                        color="accent.600"
                                    >
                                        {t("locality")} : {user.adress.locality}
                                    </Badge>
                                )}
                            </Flex>

                            <Flex justify="flex-end" gap={2} pt={2}>
                                <IconButton
                                    size="2xl"
                                    variant="ghost"
                                    onClick={() => handleSendMessage(user.id)}
                                >
                                    <SendHorizonalIcon />
                                </IconButton>
                            </Flex>
                        </Flex>
                    </Flex>
                </Card.Body>
            </LinkBox>
        );
    }
}