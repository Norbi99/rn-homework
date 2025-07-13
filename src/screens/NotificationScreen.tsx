import React, { useState } from 'react';
import {View, Text, StyleSheet, Alert, ActivityIndicator} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setProfile } from '../store/userSlice';
import { updateProfile } from '../mock/user';
import Colors from '../constants/colors';
import CustomSwitch from '../components/CustomSwitch';

const NotificationScreen = () => {
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.user.profile);

    const [loading, setLoading] = useState(false);

    if (!profile) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    const handleToggle = async (key: 'emailNotifications' | 'pushNotifications', value: boolean) => {
        try {
            setLoading(true);

            const updatedPreferences = {
                ...profile.preferences,
                [key]: value,
            };

            const updated = await updateProfile({
                preferences: updatedPreferences,
            });

            dispatch(setProfile({
                ...profile,
                preferences: updated.preferences,
            }));
        } catch (err) {
            Alert.alert('Error', 'Failed to update preferences');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{flex:1}}>
        <View style={styles.container}>
            <View style={styles.settingRow}>
                <Text style={styles.label}>Email Notifications</Text>
                <CustomSwitch
                    value={profile.preferences.emailNotifications}
                    onValueChange={(value) => handleToggle('emailNotifications', value)}
                    disabled={loading}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.label}>Push Notifications</Text>
                <CustomSwitch
                    value={profile.preferences.pushNotifications}
                    onValueChange={(value) => handleToggle('pushNotifications', value)}
                    disabled={loading}
                />
            </View>
        </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: Colors.background,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    label: {
        fontSize: 16,
        color: Colors.text,
        fontWeight: '500',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});

export default NotificationScreen;
