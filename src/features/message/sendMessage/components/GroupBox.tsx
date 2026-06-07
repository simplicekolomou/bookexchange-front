import {
    Box,
    CheckboxCard,
    CloseButton,
    Drawer,
    HStack,
    IconButton,
    Input,
    Portal,
    Spinner,
    VStack
} from "@chakra-ui/react";
import React, {useEffect, useState } from "react";
import type { UserProfile } from "../../../auth/profile/types/profile.types.ts";
import {SendHorizonalIcon} from "lucide-react";
import type {PagedResponse} from "../../types/message.types.ts";
import {useAddGroupChatMutation} from "../../messageApi.ts";
import {useTranslation} from "react-i18next";
import {useGetAllUsersQuery} from "../../../auth/api/authApi.ts";

export interface ChatBoxProps{
    onClose: () => void;
    open: boolean;
}
export const GroupBox = ({ onClose, open }: ChatBoxProps) => {
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [isLastPage, setIsLastPage] = useState(false);
    const [page, setPage] = useState(0);
    const size = 15;
    const { data, isFetching } = useGetAllUsersQuery({ page, size });
    const groupNameRef = React.useRef<HTMLInputElement | null>(null);
    const [addGroup] = useAddGroupChatMutation();
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [localError, setLocalError] = useState<string | null>(null);
    const {t} = useTranslation("message");

    // Accumulation des addpages
    useEffect(() => {
        if (!data) return;

        const newUsers = (data as PagedResponse<UserProfile>).content ?? [];

        setUsers(prev => {
            const map = new Map(prev.map(u => [u.id, u]));
            newUsers.forEach((u: UserProfile) => map.set(u.id, u));
            return Array.from(map.values());
        });

        setIsLastPage((data as PagedResponse<UserProfile>).last ?? false);

        // Autorise un nouveau chargement une fois les données traitées
        loadingRef.current = false;
    }, [data]);

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

    const getCurrentUserId = (): string | null => {
        const authRaw = localStorage.getItem('auth_user');
        if (!authRaw) return null;

        try {
            const auth = JSON.parse(authRaw);
            return String(auth.id);
        } catch {
            return null;
        }
    }
    // Gestion de la sélection des utilisateurs
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const card = target.closest('[data-checkboxcard-id]') as HTMLElement | null;
        const userId = card?.getAttribute('data-checkboxcard-id');

        if (!userId) return;

        setSelectedUserIds(prev => {
            // Récupérer et normaliser l'id courant en string de manière sûre
            const currentUserId: string | null = getCurrentUserId();

            let next: string[];
            if (target.checked) {
                next = prev.includes(userId) ? prev : [...prev, userId];
            } else {
                next = prev.filter(id => id !== userId);
            }

            // S'assurer que l'id du user courant (string) est toujours présent si disponible
            if (currentUserId && !next.includes(currentUserId)) {
                next = [...next, currentUserId];
            }

            console.log("Utilisateurs sélectionnés : ", next);
            return next;
        });
    };


    // Gestion de la sélection des utilisateurs
    const handleCreateGroupButton = async () => {
        setLocalError(null);
        const name = groupNameRef.current?.value?.trim();
        if (!selectedUserIds || selectedUserIds.length === 0) {
            return;
        }

        try {
            const payload = {
                name,
                members: selectedUserIds.map(id => ({
                    notification: true,
                    endUserId: Number(id)
                }))
            };

            await addGroup(payload).unwrap();
            setSelectedUserIds([]);
            onClose();
        } catch (error) {
            const status = (error as { status?: number })?.status;
            if (status === 401) {
                setLocalError(t("unAuthenticated"));
            } else {
                setLocalError(t("serverError"));
            }
        }
    };

    return (
        <Drawer.Root
            open={open}
            onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}
        >
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
                                {t("groupName")}
                                <Input
                                    ref={groupNameRef}
                                    w={"60%"}
                                    h={"8"}
                                    ml={1}
                                    name={"groupName"}
                                />
                            </Drawer.Title>
                        </Drawer.Header>

                        <Drawer.Body
                            flex="1"
                            overflowY="auto"
                            onScroll={handleScroll}
                        >
                            <VStack align="stretch">
                                {users.map(user => (
                                    <CheckboxCard.Root
                                        key={user.id}
                                        size="sm"
                                        data-checkboxcard-id={user.id}
                                    >
                                        <CheckboxCard.HiddenInput
                                            onChange={handleCheckboxChange}
                                        />
                                        <CheckboxCard.Control>
                                            <CheckboxCard.Content>
                                                <CheckboxCard.Label>
                                                    {user.firstName} {user.lastName}
                                                </CheckboxCard.Label>
                                            </CheckboxCard.Content>
                                            <CheckboxCard.Indicator borderRadius={"xl"} />
                                        </CheckboxCard.Control>
                                    </CheckboxCard.Root>
                                ))}

                                {isFetching && (
                                    <HStack justify="center" py={3}>
                                        <Spinner size="sm" />
                                    </HStack>
                                )}

                                {isLastPage && (
                                    <Box>Fin de la liste</Box>
                                )}
                            </VStack>
                        </Drawer.Body>

                        <Drawer.Footer borderTopWidth="1px">
                            <IconButton
                                aria-label="Créer"
                                onClick={handleCreateGroupButton}
                            >
                                <SendHorizonalIcon />
                                {localError && <Box color="red.500" ml={2}>{localError}</Box>}
                            </IconButton>
                            <Drawer.CloseTrigger asChild bg={"gray.300"}>
                                <CloseButton size="sm" onClick={onClose} />
                            </Drawer.CloseTrigger>
                        </Drawer.Footer>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
};
