import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface StoredUserProfile {
    id: string;
    name: string;
    email: string;
    bio: string;
    profilePicture: string;
    birthday: string; // serialized
    preferences: {
        emailNotifications: boolean;
        pushNotifications: boolean;
    };
}

interface UserState {
    profile: StoredUserProfile | null;
}
const initialState: UserState = {
    profile: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setProfile(state, action: PayloadAction<StoredUserProfile>) {
            const {birthday, ...rest} = action.payload;
            state.profile = {
                ...rest,
                birthday: birthday.toString(),
            }
        },
        clearProfile(state) {
            state.profile = null;
        },
    },
});

export const { setProfile, clearProfile } = userSlice.actions;
export default userSlice.reducer;
