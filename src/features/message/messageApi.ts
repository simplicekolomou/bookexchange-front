import {apiSlice} from "../../services/apiSlice.ts";
import type {GroupChat, Message} from "../../types/message.types.ts";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        getMessagesByGroupChat: builder.query<Message[], string>({
            query: (groupChatId) => ({
                url: `/messages/group/${groupChatId}`,
                method: 'GET',
            }),
            providesTags: ['Message'],
        }),

        getGroupChats: builder.query<GroupChat[], void>({
            query: () => ({
                url: `/groups/user/me`,
                method: 'GET',
            }),
            providesTags: ['Group'],
        }),

        addGroupChat: builder.mutation<GroupChat, {name?: string, members: { notification: boolean; endUserId: number }[] }>({
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

        findGroupByMembers: builder.query<GroupChat, number>({
            query: (idUser) => ({
                url: `/groups/oneToOne/${idUser}`,
                method: "GET",
            }),
            providesTags: ['Group'],
        }),

        sendMessage: builder.mutation<void, { groupChatId: string, content: string }>({
            query: ({ groupChatId, content }) => ({
                url: `/messages/group/${groupChatId}`,
                method: 'POST',
                body: { content },
            }),
            invalidatesTags: ['Message'],
        }),
    }),
});

export const {
    useGetGroupChatsQuery,
    useGetMessagesByGroupChatQuery,
    useAddGroupChatMutation,
    useDeleteGroupMutation,
    useFindGroupByMembersQuery,
    useLazyFindGroupByMembersQuery,
    useSendMessageMutation
} = messageApi;