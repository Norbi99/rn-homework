import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import ProfileEditScreen from '../screens/ProfileEditScreen';

import Colors from '../constants/colors';
import {UserProfile} from "../mock/user";

export type ProfileStackParamList = {
    ProfileView: undefined;
    ProfileEdit: {profile: UserProfile};
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

const ProfileStackNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{
            headerBackTitle: 'Back',
            headerStyle: {
                backgroundColor: Colors.card,
            },
            headerTintColor: Colors.text,
            headerTitleStyle: {
                fontWeight: 'bold',
                color: Colors.text,
            },
        }}>
            <Stack.Screen
                name="ProfileView"
                component={ProfileScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ProfileEdit"
                component={ProfileEditScreen}
                options={{ title: 'Edit Profile'}}

            />
        </Stack.Navigator>
    );
};

export default ProfileStackNavigator;
