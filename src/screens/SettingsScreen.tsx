import React, {useState} from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Colors from '../constants/colors';
import Button from '../components/Button';
import { RootState } from '../store';
import CustomSwitch from '../components/CustomSwitch';
import {showSuccess} from "../utils/toast";

const SettingsScreen = () => {
    const [darkMode, setDarkMode] = useState(false);

    const insets = useSafeAreaInsets();
    const dispatch = useDispatch();

    const profile = useSelector((state: RootState) => state.user.profile);

    if (!profile) return null;

    const toggleDarkMode = () => {
        setDarkMode((prev) => !prev);
    };

    const handleLogout = () => {
            showSuccess('Logged Out', 'You have been logged out successfully.');
            //todo logic could come here
    };

    return (
        <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}
        >
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Preferences</Text>
                <View style={styles.settingRow}>
                    <Text style={styles.settingLabel}>Dark Mode</Text>
                    <CustomSwitch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                    />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <View style={styles.aboutBox}>
                    <Text style={styles.aboutText}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut perspiciatis unde omnis iste natus error sit voluptatem.
                    </Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <Button title="Logout" onPress={handleLogout} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        paddingHorizontal: 24,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.mutedText,
        marginBottom: 12,
    },
    settingRow: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 16,
        color: Colors.text,
    },
    aboutBox: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
    },
    aboutText: {
        color: Colors.text,
        fontSize: 14,
    },
});

export default SettingsScreen;
