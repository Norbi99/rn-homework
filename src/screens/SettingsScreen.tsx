import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Switch,
    Alert,
    SectionList,
    SafeAreaView,
} from 'react-native';
import Colors from '../constants/colors';
import Button from '../components/Button';

const SettingsScreen = () => {
    // UI toggle state only (no real functionality yet)
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        Alert.alert('Logged out', 'You have been logged out successfully.');
    };

    const sections = [
        {
            title: 'Preferences',
            data: [
                {
                    key: 'darkMode',
                    render: () => (
                        <View style={styles.row}>
                            <Text style={styles.label}>Dark Mode</Text>
                            <Switch
                                value={darkMode}
                                onValueChange={setDarkMode}
                            />
                        </View>
                    ),
                },
            ],
        },
        {
            title: 'About',
            data: [
                {
                    key: 'aboutText',
                    render: () => (
                        <View style={styles.textBlock}>
                            <Text style={styles.aboutText}>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut
                                perspiciatis unde omnis iste natus error sit voluptatem.
                            </Text>
                        </View>
                    ),
                },
            ],
        },
        {
            title: 'Account',
            data: [
                {
                    key: 'logout',
                    render: () => (
                        <View style={styles.logoutButtonWrapper}>
                            <Button title="Logout" onPress={handleLogout} />
                        </View>
                    ),
                },
            ],
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => item.render()}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    listContent: {
        padding: 20,
    },
    sectionHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.mutedText,
        marginTop: 24,
        marginBottom: 8,
    },
    row: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        color: Colors.text,
    },
    textBlock: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    aboutText: {
        fontSize: 14,
        color: Colors.text,
    },
    logoutButtonWrapper: {
        marginTop: 8,
    },
});

export default SettingsScreen;
