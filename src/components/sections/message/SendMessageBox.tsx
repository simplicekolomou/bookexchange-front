import {
    Box,
    CloseButton,
    Drawer,
    HStack,
    Portal, Spinner,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {useGetAllUsersQuery, useGetCurrentUserQuery} from "../../../features/profile/profileApi.ts";
import {useTranslation} from "react-i18next";
import type {UserProfile} from "../../../types/profile.types.ts";
import type {GroupChat, PagedResponse} from "../../../types/message.types.ts";
import {ChatBox} from "./ChatBox.tsx";
import {useAddGroupChatMutation, useLazyFindGroupByMembersQuery} from "../../../features/message/messageApi.ts";
interface SendMessageBoxProps {
    open: boolean;
    onClose: () => void;
    onGroupSelected: (group: GroupChat) => void; // <-- nouveau
}
export const SendMessageBox = ({ onClose, open }: SendMessageBoxProps) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [page, setPage] = useState(0);
    const size = 15;
    const {data, isFetching} = useGetAllUsersQuery({page, size});
    const [isLastPage, setIsLastPage] = useState(false);
    const {t} = useTranslation("message");
    const [activeChotBox, setActiveChotBox] = useState(false);
    const [addGroup] = useAddGroupChatMutation();
    const [localError, setLocalError] = useState<string | null>(null);
    const [currentGroup, setCurrentGroup] = useState<GroupChat | null>(null);
    const [triggerFindGroup] = useLazyFindGroupByMembersQuery();
    const { data: currentUser } = useGetCurrentUserQuery();

    const handleUserClick = async (user: UserProfile) => {
        setLocalError(null);

        // 1. D'abord, chercher si un groupe existe déjà
        try {
            console.log("Dans le try catch")
            // Supposons que vous ayez un endpoint pour chercher un groupe par membres
            try {
                const existingGroup = await triggerFindGroup(Number(user.id)).unwrap();
                // 2. Si trouvé, utiliser le groupe existant
                setCurrentGroup(existingGroup);
                onClose();
            }catch (error){
                const status = (error as { status?: number })?.status;
                if (status === 404) {
                    console.log("Aucun groupe existant, création d'un nouveau...");
                    // 3. Sinon, créer un nouveau groupe
                    try {
                        console.log("Le user cliqué :", user);
                        if(currentUser){
                            console.log("L'utilisateur courant :", currentUser);
                        }else{
                            console.log("Utilisateur courant introuvable");
                        }

                        const payload = {
                            name: `${user.firstName} ${user.lastName}`,
                            members: [
                                { notification: true, endUserId: Number(user.id) },
                                { notification: true, endUserId: Number(currentUser!.id) }
                            ]
                        };
                        console.log("Payload pour le nouveau groupe :", payload);
                        const newGroup: GroupChat = await addGroup(payload).unwrap();

                        console.log("Le nouveau groupe a été créé avec l'ID :", newGroup);

                        // 4. Ouvrir le nouveau groupe
                        setCurrentGroup(newGroup);
                        onClose();
                    } catch (error) {
                        const status = (error as { status?: number })?.status;
                        if (status === 401) {
                            setLocalError(t("unAuthenticated"));
                        } else {
                            setLocalError(t("serverError"));
                        }
                    }
                } else {
                    setLocalError(t("serverError"));
                }
            }
        } catch (error) {
            console.log("Aucun groupe existant, création d'un nouveau...", error);
        }
    };

    useEffect(() => {
        if (currentGroup) {
            setActiveChotBox(true);
        }
    }, [currentGroup]);

    useEffect(() => {
        if(!data) return;
        const newUsers = (data as PagedResponse<UserProfile>).content ?? [];

        setUsers(prev => {
            const map = new Map(prev.map(u => [u.id, u]));
            newUsers.forEach((u: UserProfile) => map.set(u.id, u));
            return Array.from(map.values());
        });

        setIsLastPage((data as PagedResponse<UserProfile>).last ?? false);
        loadingRef.current = false;

    }, [data, open]);

    // Scroll handler
    const loadingRef = React.useRef(false);
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.currentTarget;
        const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;

        if (nearBottom && !isFetching && !isLastPage && !loadingRef.current) {
            loadingRef.current = true;
            setPage(p => p + 1);
        }
    };


    if (!users) return null;

    return (
        <>
            <Drawer.Root
                open={open}
                onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
            >
                {localError && (
                    <Box color="red.500" p={2} textAlign="center">
                        {localError}
                    </Box>
                )}
                <Portal>
                    <Drawer.Backdrop />
                    <Drawer.Positioner padding={{ base: 0, md: 4 }}>
                        <Drawer.Content
                            bg="gray.700"
                            display="flex"
                            flexDirection="column"
                            color="gray.300"
                            h={{ base: "90%", md: "100%" }}
                        >
                            <Drawer.Header
                                borderBottomWidth="1px"
                                flexWrap="wrap"
                                display="flex"
                            >
                                <Drawer.Title>
                                    {t("users")}
                                </Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body
                                flex="1"
                                overflowY="auto"
                                onScroll={handleScroll}
                            >
                                <VStack align="stretch">
                                    {users.map(user => (
                                        <Box
                                            key={user.id}
                                            gap={2}
                                            p={2}
                                            border={"1px solid"}
                                            borderRadius={"md"}
                                            cursor="pointer"
                                            onClick={() => handleUserClick(user)}
                                            bg={"gray.800"}
                                        >
                                            {user.firstName} {user.lastName}
                                        </Box>
                                    ))}

                                    {isFetching && (
                                        <HStack justify="center" py={3}>
                                            <Spinner size="sm" />
                                        </HStack>
                                    )}

                                    {isLastPage && (
                                        <Box textAlign="center" py={3}>Fin de la liste</Box>
                                    )}
                                </VStack>
                            </Drawer.Body>

                            <Drawer.Footer borderTopWidth="1px">
                                <Drawer.CloseTrigger asChild bg={"gray.300"}>
                                    <CloseButton size="sm" onClick={onClose} />
                                </Drawer.CloseTrigger>
                            </Drawer.Footer>
                        </Drawer.Content>
                    </Drawer.Positioner>
                </Portal>
            </Drawer.Root>
            <ChatBox
                chatGroup={ currentGroup }
                onClose={() => setActiveChotBox(false)}
                open={activeChotBox}
            />
        </>
    );
}