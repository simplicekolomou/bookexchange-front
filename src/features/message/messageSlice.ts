import {createSlice} from "@reduxjs/toolkit";
import type {MessageState} from "./types/message.types.ts";

const initialState: MessageState = {
    messages: [],
    isLoading: false,
    error: null,
    groupChats: [],
    currentChat: null
}
export const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {

    }
})