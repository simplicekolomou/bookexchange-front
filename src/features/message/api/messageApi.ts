import {baseApi} from "../../../services/baseApi.ts";
import type {AddGroupRequest, Chat, Message} from "../types/message.types.ts";

export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        getMessagesByChat: builder.query<Message[], string>({
            query: (chatId) => ({
                url: `/messages/chats/${chatId}`,
                method: 'GET',
            }),
            providesTags: ['Message'],
        }),

        getMyChats: builder.query<Chat[], void>({
            query: () => ({
                url: `/chats/user/me`,
                method: 'GET',
            }),
            providesTags: ['Chat'],
        }),

        addChat: builder.mutation<Chat, AddGroupRequest>({
            query: ({name, chatType, members }) => ({
                url: '/chats',
                method: 'POST',
                body: { name, chatType, members },
            }),
            invalidatesTags: ['Chat'],
        }),

        deleteChat : builder.mutation<void, string>({
            query: (chatId) => ({
                url: `/chats/${chatId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Chat'],
        }),

        sendMessage: builder.mutation<void, { chatId: string, content: string }>({
            query: ({ chatId, content }) => ({
                url: `/messages/chats/${chatId}`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: ['Message'],
        }),

        findChatByMembers: builder.query<Chat, number>({
            query: (idUser) => ({
                url: `/groups/one-to-one/${idUser}`,
                method: "GET",
            }),
            providesTags: ['Chat'],
        }),

        // Marquer un message spécifique comme lu
        markMessageAsRead: builder.mutation<void, { messageId: number }>({
            query: ({ messageId }) => ({
                url: `/messages/${messageId}/read`,
                method: 'POST',
            }),
            // Invalider les compteurs de non-lus pour ce chat
            invalidatesTags: (_result, _error,
                              { messageId }) => [{ type: 'UnreadCount', id: messageId }],
        }),

        // Marquer tous les messages d'une conversation comme lus
        markAllMessageOfChatAsRead: builder.mutation<void, { chatId: string }>({
            query: ({ chatId }) => ({
                url: `/messages/chats/${chatId}/read`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error,
                              { chatId }) => [{ type: 'UnreadCount', id: chatId }],
        }),

        // 3. Obtenir le compteur de non-lus pour une conversation spécifique
        getUnreadCountForChat: builder.query<number, { chatId: string }>({
            query: ({ chatId }) => ({
              url: `/messages/chats/${chatId}/unread-count`,
              method:  'GET',
            }),
            providesTags: (_result, _error, { chatId }) => [{ type: 'UnreadCount', id: chatId }],
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