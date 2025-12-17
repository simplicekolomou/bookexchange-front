import {Card, Text, Flex, Heading, Image, LinkBox, LinkOverlay, IconButton} from "@chakra-ui/react";
import {Link as RouterLink} from "react-router-dom";
import type {BookCopyAndOwner} from "../../types/book.types.ts";
import {MessageCircle} from "lucide-react";

interface UserCardProps {
    bookAndOwner: BookCopyAndOwner;
    viewMode?: 'grid' | 'list';
}
export const UserCard = ({bookAndOwner}: UserCardProps) => {
    if(bookAndOwner){
        return (
            <LinkBox as={Card.Root} overflow="hidden" borderRadius="lg" shadow="sm" bg="white" h="100%">
                {/*@ts-expect-error Chakra LinkOverlay does not support "to" in TS*/}
                <LinkOverlay as={RouterLink} to={`/user/${bookAndOwner.owner.id}/profile`}/>
                <Image
                    src={bookAndOwner.bookCopy.coverPictureApiUrl}
                    alt={bookAndOwner.owner.firstName}
                    objectFit="cover"
                    w="full"
                    h="180px"
                    borderTopRadius="lg"
                />

                {/* Make the body stretch fully */}
                <Card.Body p={4} display="flex" flexDirection="column" flex="1">
                    {/* Main content */}
                    <Flex direction="column" gap={2} flex="1">
                        <Text>Appartient à : </Text>
                        <Heading size="sm">{bookAndOwner.owner.firstName} {bookAndOwner.owner.lastName}</Heading>
                    </Flex>
                </Card.Body>
                {/* Actions */}
                <Flex direction="column" gap={2} mb="auto">
                    <IconButton
                        aria-label="Envoyer un message"
                        size="md"
                        variant="ghost"
                    >
                        <MessageCircle />
                    </IconButton>
                </Flex>
            </LinkBox>
        );
    }
}