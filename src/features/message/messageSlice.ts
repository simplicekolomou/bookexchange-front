import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {GroupChat, MessageState, NotificationItem} from "./types/message.types.ts";
import type {RootState} from "../../app/store.ts";

const initialState: MessageState = {
    activeChats: [],
    activeTab: 'messages',
    isGroupBoxOpen: false,
    isSendMessageBoxOpen: false,
    notifications: [],
};

const MAX_NOTIFICATIONS = 100;

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        addActiveChat: (state, action: PayloadAction<GroupChat>) => {
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
            state.isGroupBoxOpen = true;
        },
        closeGroupBox: (state) => {
            state.isGroupBoxOpen = false;
            // Optionnel : si vous souhaitez garder l'onglet actif, ne pas changer activeTab
        },
        openSendMessageBox: (state) => {
            state.isSendMessageBoxOpen = true;
        },
        closeSendMessageBox: (state) => {
            state.isSendMessageBoxOpen = false;
        },

        // ── Notifications ─────────────────────────────────────────
        /*notificationAdded(state, action: PayloadAction<Omit<NotificationItem, "id">>) {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            const notification: NotificationItem = {
                ...action.payload,
                id,
                chatId: String(action.payload.chatId ?? ""), // ✅ ne pas écraser avec ""
                sendTime: action.payload.sendTime ?? new Date().toISOString(),
            };

            state.notifications.unshift(notification);

            // ✅ limite à 100 notifications
            if (state.notifications.length > MAX_NOTIFICATIONS) {
                state.notifications.pop();
            }
        },*/

        notificationAdded(state, action: PayloadAction<Omit<NotificationItem, "id">>) {
            const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
            const payloadSendTime = action.payload.sendTime;
            const sendTime =
                typeof payloadSendTime === "string" || payloadSendTime instanceof Date
                    ? payloadSendTime
                    : new Date().toISOString();
            const notification: NotificationItem = {
                ...action.payload,
                id,
                chatId: String(action.payload.chatId ?? ""), // Ne pas écraser avec ""
                sendTime,
            };
            state.notifications.unshift(notification);
            // Limite à 100 notifications
            if (state.notifications.length > MAX_NOTIFICATIONS) {
                state.notifications.pop();
            }
        },

        notificationsCleared(state) {
            state.notifications = [];
        },

        notificationsMarkedReadForChat(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (n) => n.chatId !== action.payload
            );
        },

        notificationRemoved(state, action: PayloadAction<string>) {
            state.notifications = state.notifications.filter(
                (n) => n.id !== action.payload
            );
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
    notificationAdded,
    notificationsCleared,
    notificationsMarkedReadForChat,
    notificationRemoved,
} = messageSlice.actions;

export const selectActiveChats = (state: RootState) => state.message.activeChats;
export const selectActiveTab = (state: RootState) => state.message.activeTab;
export const selectIsGroupBoxOpen = (state: RootState) => state.message.isGroupBoxOpen;
export const selectIsSendMessageBoxOpen = (state: RootState) => state.message.isSendMessageBoxOpen;
export const selectNotifications     = (state: RootState) => state.message.notifications;
export const selectNotificationsCount = (state: RootState) => state.message.notifications.length;
export const selectUnreadForChat     = (chatId: string) =>
    (state: RootState) =>
        state.message.notifications.filter((n) => n.chatId === chatId).length;
export default messageSlice.reducer;