import {createSlice} from "@reduxjs/toolkit";

export interface MessageState {
    id: null

}
const messageSlice = createSlice({
    name: "message",
    initialState: {},
    reducers: {

    },
})

export const { } = messageSlice.actions;
export default messageSlice.reducer;