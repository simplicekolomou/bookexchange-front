import {baseApi} from "../../../services/baseApi.ts";
import type {AddChatRequest, Chat, Message} from "../types/message.types.ts";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMessagesByChat: builder.query<Message[], string>({
            query: (chatId) => ({
                url: `/messages/chats/${chatId}`,
                method: 'GET',
            }),

            // On corrige le placement des accolades : le tag LIST doit être un
            // ÉLÉMENT DU TABLEAU (donc après la fermeture de .map(...)),
            // et non un argument passé À .map() lui-même.
            providesTags: (result, _error, chatId) =>
                result
                    ? [
                        // Un tag PAR MESSAGE reçu, pour permettre l'invalidation
                        // ciblée d'un seul message précis (ex: si un message est
                        // édité ou supprimé individuellement plus tard)
                        ...result.map(
                            (message) => ({ type: 'Message' as const, id: message.id })
                        ),

                        // Le tag LIST, ICI SCOPÉ PAR CHAT plutôt que générique.
                        // Voir l'explication détaillée juste après ce bloc de code
                        // sur POURQUOI on utilise `LIST-${chatId}` plutôt que
                        // simplement 'LIST'.
                        { type: 'Message' as const, id: `LIST-${chatId}` },
                    ]
                    : [{ type: 'Message' as const, id: `LIST-${chatId}` }],
        }),

        getMyChats: builder.query<Chat[], void>({
            query: () => ({ url: `/chats/user/me`, method: 'GET' }),
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((chat) => ({ type: 'Chat' as const, id: chat.id })),
                        // Petit ajout de "as const" ici aussi, par cohérence et
                        // sécurité de typage (même si dans ce cas précis, ça
                        // fonctionnait déjà probablement grâce à l'inférence
                        // du tableau entier — mais autant être explicite partout)
                        { type: 'Chat' as const, id: 'LIST' },
                    ]
                    : [{ type: 'Chat' as const, id: 'LIST' }],
        }),

        addChat: builder.mutation<Chat, AddChatRequest>({
            query: ({ name, chatType, members }) => ({
                url: '/chats',
                method: 'POST',
                body: { name, chatType, members },
            }),
            invalidatesTags: [{ type: 'Chat', id: 'LIST' }],
        }),

        deleteChat: builder.mutation<void, string>({
            query: (chatId) => ({
                url: `/chats/${chatId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, chatId) =>
                [{ type: 'Chat', id: chatId }],
        }),

        sendMessage: builder.mutation<void, { chatId: string; content: string }>({
            query: ({ chatId, content }) => ({
                url: `/messages/chats/${chatId}`,
                method: 'POST',
                body: { content },
            }),

            invalidatesTags: (_result, _error, { chatId }) => [
                // "LIST-${chatId}" plutôt que "LIST" générique : seul le chat
                // concerné par ce nouveau message sera rechargé, pas tous les
                // autres chats de l'utilisateur.
                { type: 'Message', id: `LIST-${chatId}` },
                { type: 'UnreadCount', id: chatId },
            ],
        }),

        findChatByMembers: builder.query<Chat, { chatType: string; targetUserId?: string }>({
            query: ({ chatType, targetUserId }) => ({
                url: `/chats/get-chat`,
                method: 'GET',
                params: { chatType, targetUserId },
            }),
            providesTags: (result) =>
                result
                    ? [{ type: 'Chat', id: result.id }]
                    : [{ type: 'Chat', id: 'LIST' }],
        }),

        // Marquer un message spécifique comme lu
        markMessageAsRead: builder.mutation<{ chatId: string }, { messageId: number }>({
            query: ({ messageId }) => ({
                url: `/messages/${messageId}/read`,
                method: 'POST'
            }),
            invalidatesTags: (result) =>
                result ? [{ type: 'UnreadCount', id: result.chatId }] : [],
        }),

        // Marquer tous les messages d'une conversation comme lus
        markAllMessageOfChatAsRead: builder.mutation<void, { chatId: string }>({
            query: ({ chatId }) => ({
                url: `/messages/chats/${chatId}/read`,
                method: 'POST'
            }),
            invalidatesTags: (_result, _error, { chatId }) =>
                    [{ type: 'UnreadCount', id: chatId }],
        }),

        // Obtenir le compteur de non-lus pour une conversation spécifique
        getUnreadCountForChat: builder.query<number, { chatId: string }>({
            query: ({ chatId }) => ({
                url: `/messages/chats/${chatId}/unread-count`,
                method: 'GET'
            }),
            providesTags: (_result, _error, { chatId }) =>
                            [{ type: 'UnreadCount', id: chatId }],
        }),

    }),
});

export const {
    useGetMessagesByChatQuery,
    useGetMyChatsQuery,
    useAddChatMutation,
    useDeleteChatMutation,
    useLazyFindChatByMembersQuery,
    useMarkAllMessageOfChatAsReadMutation,
    useGetUnreadCountForChatQuery,
} = messageApi;