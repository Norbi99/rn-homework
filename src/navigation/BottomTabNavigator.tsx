import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import ProfileStackNavigator from './ProfileStackNavigator';
import SettingsScreen from '../screens/SettingsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import Colors from '../constants/colors';

type RouteName = 'Home' | 'Profile' | 'Settings' | 'Notifications';
type IoniconName = keyof typeof Ionicons.glyphMap;

const ICONS: Record<RouteName, { focused: IoniconName; unfocused: IoniconName }> = {
    Home: {
        focused: 'home',
        unfocused: 'home-outline',
    },
    Profile: {
        focused: 'person',
        unfocused: 'person-outline',
    },
    Settings: {
        focused: 'settings',
        unfocused: 'settings-outline',
    },
    Notifications: {
        focused: 'notifications',
        unfocused: 'notifications-outline',
    },
};

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();
    const isAndroid = Platform.OS === 'android';

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, size, focused }) => {
                    const routeName = route.name as RouteName;
                    const iconName: IoniconName = focused
                        ? ICONS[routeName].focused
                        : ICONS[routeName].unfocused;

                    return (
                        <View style={{ alignItems: 'center', justifyContent: 'center', top: 8 }}>
                            <Ionicons name={iconName} size={size} color={color} />
                        </View>
                    );
                },
                tabBarShowLabel: false,
                headerShown: false,
                tabBarActiveTintColor: Colors.accent,
                tabBarInactiveTintColor: Colors.text,
                tabBarStyle: [
                    styles.tabBar,
                    {
                        marginBottom: isAndroid ? insets.bottom + 10 : 20, // only elevate on Android
                    },
                ],
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Profile" component={ProfileStackNavigator} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="Notifications" component={NotificationScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        marginHorizontal: 10,
        backgroundColor: Colors.card,
        borderRadius: 30,
        height: 60,
        elevation: 5,
        shadowColor: Colors.text,
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
    },
});

export default BottomTabNavigator;
