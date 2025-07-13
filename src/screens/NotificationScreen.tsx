import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/colors';
import CustomSwitch from '../components/CustomSwitch';
import { RootState } from '../store';
import { updateProfile } from '../mock/user';
import { setProfile } from '../store/userSlice';
import { showError, showSuccess } from '../utils/toast';

/**
 * Notification Preferences Screen
 */
const NotificationScreen = () => {
    // Redux state
    const dispatch = useDispatch();
    const profile = useSelector((state: RootState) => state.user.profile);

    // Local loading state
    const [loading, setLoading] = useState(false);

    // Exit early if profile is not loaded
    if (!profile) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    /**
     * Handle toggling of either notification type
     */
    const handleToggle = async (
        key: 'emailNotifications' | 'pushNotifications',
        value: boolean
    ) => {
        try {
            setLoading(true);

            const updatedPreferences = {
                ...profile.preferences,
                [key]: value,
            };

            const updated = await updateProfile({ preferences: updatedPreferences });

            dispatch(
                setProfile({
                    ...profile,
                    preferences: updated.preferences,
                })
            );

            showSuccess('Preferences Updated', 'Your settings have been saved.');
        } catch {
            showError('Update Failed', 'Could not save your preferences.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Optional loading indicator */}
                {loading && (
                    <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
                        <ActivityIndicator size="small" color={Colors.accent} />
                    </View>
                )}

                {/* Email Notification Toggle */}
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Email Notifications</Text>
                    <CustomSwitch
                        value={profile.preferences.emailNotifications}
                        onValueChange={(value) =>
                            handleToggle('emailNotifications', value)
                        }
                        disabled={loading}
                    />
                </View>

                {/* Push Notification Toggle */}
                <View style={styles.settingRow}>
                    <Text style={styles.label}>Push Notifications</Text>
                    <CustomSwitch
                        value={profile.preferences.pushNotifications}
                        onValueChange={(value) =>
                            handleToggle('pushNotifications', value)
                        }
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
