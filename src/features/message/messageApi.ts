import {apiSlice} from "../../services/apiSlice.ts";
import type {GroupChat, Message} from "../../types/message.types.ts";
import {mockMessagesByGroup} from "../../types/mock.ts";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getMessages: builder.query<GroupChat, void>({
            query: () => ({
                url: `/groups/user/messages`,
                method: 'GET',
            }),
            providesTags: ['Group'],
        }),

        getGroupChats: builder.query<GroupChat[], void>({
            query: () => ({
                url: `/groups/user/me`,
                method: 'GET',
            }),
            providesTags: ['Group'],
        }),

        getMessagesByGroupChat: builder.query<Message[], string>({
            queryFn: async (chatId) => {
                return { data: mockMessagesByGroup[chatId] ?? [] };
            },
            providesTags: (_result, _error, chatId) => [{ type: "Message" as const, id: chatId }],
        }),

        addGroupChat: builder.mutation<void, {name: string, members: { notification: boolean; endUserId: number }[] }>({
            query: ({name, members }) => ({
                url: '/groups',
                method: 'POST',
                body: { name, members },
            }),
            invalidatesTags: ['Group'],
        }),

        deleteGroup : builder.mutation<void, string>({
            query: (groupId) => ({
                url: `/groups/${groupId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Group'],
        }),

    }),
});

export const {
    useGetGroupChatsQuery,
    useGetMessagesByGroupChatQuery,
    useAddGroupChatMutation,
    useGetMessagesQuery,
    useDeleteGroupMutation,
} = messageApi;