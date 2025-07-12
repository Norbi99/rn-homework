import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

export type ProfileStackParamList = {
    ProfileView: undefined;
    ProfileEdit: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="ProfileView"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ title: 'Edit Profile' }}
            />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
