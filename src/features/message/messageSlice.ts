import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {Chat, MessageState} from "./types/message.types.ts";
import type {RootState} from "../../app/store.ts";

const initialState: MessageState = {
    activeChats: [],
    activeTab: 'messages',
    isChatBoxOpen: false,
    isSendMessageBoxOpen: false,
    notifications: [],
    unreadMessageCount: 0,
};

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addActiveChat: (state, action: PayloadAction<Chat>) => {
            const exists = state.activeChats.some(chat => chat.id === action.payload.id);
            if (!exists) {
                state.activeChats.unshift(action.payload);
            }
        },
        removeActiveChat: (state, action: PayloadAction<string>) => {
            state.activeChats = state.activeChats.filter(chat => chat.id !== action.payload);
        },

        // Gestion des onglets
        setActiveTab: (state, action: PayloadAction<string>) => {
            state.activeTab = action.payload;
        },

        // Gestion des modales
        openGroupBox: (state) => {
            state.isChatBoxOpen = true;
        },
        closeGroupBox: (state) => {
            state.isChatBoxOpen = false;
            // Optionnel : si vous souhaitez garder l'onglet actif, ne pas changer activeTab
        },
        openSendMessageBox: (state) => {
            state.isSendMessageBoxOpen = true;
        },
        closeSendMessageBox: (state) => {
            state.isSendMessageBoxOpen = false;
        },
    },
});

export const {
    addActiveChat,
    removeActiveChat,
    setActiveTab,
    openGroupBox,
    closeGroupBox,
    openSendMessageBox,
    closeSendMessageBox,
} = messageSlice.actions;

export const selectActiveChats = (state: RootState) => state.message.activeChats;
export const selectActiveTab = (state: RootState) => state.message.activeTab;
export const selectIsGroupBoxOpen = (state: RootState) => state.message.isChatBoxOpen;
export const selectIsSendMessageBoxOpen = (state: RootState) => state.message.isSendMessageBoxOpen;
export default messageSlice.reducer;