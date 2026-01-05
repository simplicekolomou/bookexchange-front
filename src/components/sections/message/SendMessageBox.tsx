import {
    Box,
    CloseButton,
    Drawer,
    HStack,
    Portal, Spinner,
    VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {useGetAllUsersQuery, useGetCurrentUserQuery, useGetUserQuery} from "../../../features/profile/profileApi.ts";
import {useTranslation} from "react-i18next";
import type {UserProfile} from "../../../types/profile.types.ts";
import type {GroupChat, PagedResponse} from "../../../types/message.types.ts";
import {useAddGroupChatMutation, useLazyFindGroupByMembersQuery} from "../../../features/message/messageApi.ts";
import {useLocation} from "react-router-dom";

interface SendMessageBoxProps {
    open?: boolean;
    onClose?: () => void;
    onGroupSelected?: (group: GroupChat) => void;
}

export const SendMessageBox = ({ onClose, open, onGroupSelected }: SendMessageBoxProps) => {
    const [localUsersForPagination, setLocalUsersForPagination] = useState<UserProfile[]>([]);
    const [page, setPage] = useState(0);
    const size = 15;
    const {data: loadedUsers, isFetching} = useGetAllUsersQuery({page, size});
    const [isLastPage, setIsLastPage] = useState(false);
    const {t} = useTranslation("message");
    const [addGroup] = useAddGroupChatMutation();
    const [localError, setLocalError] = useState<string | null>(null);
    const [triggerFindGroup] = useLazyFindGroupByMembersQuery();
    const { data: currentUser } = useGetCurrentUserQuery();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const userId = params.get("user") ?? undefined;
    const { data: targetUser } = useGetUserQuery({ userId: userId ?? "" }, { skip: !userId });

    const handleUserClick = async (user: UserProfile) => {
        setLocalError(null);

        try {
            // essayer de trouver un groupe existant
            try {
                const existingGroup = await triggerFindGroup(Number(user.id)).unwrap();
                if (onGroupSelected) {
                    onGroupSelected(existingGroup);
                }
                if (onClose) {
                    onClose();
                }
                return;
            } catch (error) {
                const status = (error as { status?: number })?.status;
                if (status !== 404) {
                    setLocalError(t("serverError"));
                    return;
                }
                // si 404 => on continue pour créer
            }

            // créer un nouveau groupe si pas trouvé
            const payload = {
                name: `${user.firstName} ${user.lastName}`,
                members: [
                    { notification: true, endUserId: Number(user.id) },
                    { notification: true, endUserId: Number(currentUser!.id) }
                ]
            };
            const newGroup: GroupChat = await addGroup(payload).unwrap();
            if (onGroupSelected) {
                onGroupSelected(newGroup);
            }
            if (onClose) {
                onClose();
            }
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 401) {
                setLocalError(t("unAuthenticated"));
            } else {
                setLocalError(t("serverError"));
            }
        }
    };

    useEffect(() => {
        if (!userId || !targetUser) return;

        const openConversation = async () => {
            await handleUserClick(targetUser);
        };

        openConversation();
    }, [userId, targetUser]);

    useEffect(() => {
        if(!loadedUsers) return;
        const newUsers = (loadedUsers as PagedResponse<UserProfile>).content ?? [];

        setLocalUsersForPagination(prev => {
            const map = new Map(prev.map(u => [u.id, u]));
            newUsers.forEach((u: UserProfile) => map.set(u.id, u));
            return Array.from(map.values());
        });

        setIsLastPage((loadedUsers as PagedResponse<UserProfile>).last ?? false);
        loadingRef.current = false;

    }, [loadedUsers, open]);

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


    if (!localUsersForPagination) return null;

    return (
        <>
            <Drawer.Root
                open={open}
                onOpenChange={(isOpen) => { if (!isOpen) if (onClose) {
                    onClose();
                } }}
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
                                    {t("sendMessage")}
                                </Drawer.Title>
                            </Drawer.Header>

                            <Drawer.Body
                                flex="1"
                                overflowY="auto"
                                onScroll={handleScroll}
                            >
                                <VStack align="stretch">
                                    {localUsersForPagination.map(user => (
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
        </>
    );
}
