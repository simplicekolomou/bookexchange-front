import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {NotificationSettings, UserProfile, UserStats} from "../../types/user.types.ts";

export interface UserState {
    user: UserProfile | null;
    stats: UserStats | null;
    notificationSettings: NotificationSettings | null;
}

const initialState: UserState = {
    user: null,
    stats: null,
    notificationSettings: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        userUpdated(state, action: PayloadAction<UserState>) {
            state.user = action.payload.user;
            state.stats = action.payload.stats;
            state.notificationSettings = action.payload.notificationSettings;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            (action): action is PayloadAction<UserState> =>
                action.type === "user/userUpdated",
            (state, action) => {
                state.user = action.payload.user;
                state.stats = action.payload.stats;
                state.notificationSettings = action.payload.notificationSettings;
            }
        );
    },
});

export const { userUpdated } = userSlice.actions;
export default userSlice.reducer;