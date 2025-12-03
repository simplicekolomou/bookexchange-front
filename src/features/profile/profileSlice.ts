import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {NotificationSettings, UserProfile, ProfileStats} from "../../types/profile.types.ts";

export interface ProfileState {
    profile: UserProfile | null;
    stats: ProfileStats | null;
    notificationSettings: NotificationSettings | null;
}

const initialState: ProfileState = {
    profile: null,
    stats: null,
    notificationSettings: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        profileUpdated(state, action: PayloadAction<Partial<ProfileState>>) {
            const payload = action.payload;
            if (payload.profile !== undefined) state.profile = payload.profile;
            if (payload.stats !== undefined) state.stats = payload.stats;
            if (payload.notificationSettings !== undefined) state.notificationSettings = payload.notificationSettings;
        },

        pictureUpdated(state, action: PayloadAction<Partial<ProfileState>>) {
            const payload = action.payload;
            if (payload.profile !== undefined) state.profile = payload.profile;
        },


        passwordUpdated(state, action: PayloadAction<Partial<ProfileState>>) {
            const payload = action.payload;
            if (payload.profile !== undefined) state.profile = payload.profile;
            if (payload.stats !== undefined) state.stats = payload.stats;
            if (payload.notificationSettings !== undefined) state.notificationSettings = payload.notificationSettings;
        }
    },
});

export const { profileUpdated, passwordUpdated } = profileSlice.actions;
export default profileSlice.reducer;