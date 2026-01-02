import {apiSlice} from "../../services/apiSlice.ts";
import type {GroupChat, Message} from "../../types/message.types.ts";
import {mockChats, mockMessagesByGroup} from "../../types/mock.ts";

export const messageApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getChats: builder.query<GroupChat[], void>({
            queryFn: async () => {
                console.log("[messageApi] queryFn getChats -> returning mockChats", mockChats);
                return { data: mockChats };
            },
            providesTags: ['Chat']
        }),

        getMessagesByChat: builder.query<Message[], string>({
            queryFn: async (chatId) => {
                console.log("[messageApi] queryFn getMessagesByChat -> returning mock for", chatId, mockMessagesByGroup[chatId]);
                return { data: mockMessagesByGroup[chatId] ?? [] };
            },
            providesTags: (_result, _error, chatId) => [{ type: "Message" as const, id: chatId }],
        }),
    }),
});

export const {
    useGetChatsQuery,
    useGetMessagesByChatQuery
} = messageApi;