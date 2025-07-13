import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import Colors from '../constants/colors';
import Button from '../components/Button';
import Card from '../components/Card';

type RootStackParamList = {
    Profile: undefined;
};

const HomeScreen = () => {
    /**
     * Navigation setup
     */
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    /**
     * Select user profile from Redux store
     */
    const profile = useSelector((state: RootState) => {
        const p = state.user.profile;
        return p ? { ...p, birthday: new Date(p.birthday) } : null;
    });

    /**
     * Local state: formatted current date
     */
    const [currentDate, setCurrentDate] = useState('');

    /**
     * Format and store current date on mount
     */
    useEffect(() => {
        const date = new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(date);
    }, []);

    /**
     * Show loading spinner while profile is null
     */
    if (!profile) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    /**
     * Main screen UI
     */
    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={styles.container}>
            <Card style={styles.card}>
                <Text style={styles.welcome}>Welcome, {profile.name}!</Text>
                <Text style={styles.date}>{currentDate}</Text>

                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: '80%' }]} />
                </View>
                <Text style={styles.progressLabel}>Profile completion: 80%</Text>

                <Button title="Go to your profile!" onPress={() => navigation.navigate('Profile')} />
            </Card>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    card: {
        width: '100%',
    },
    welcome: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 10,
    },
    date: {
        fontSize: 16,
        color: Colors.mutedText,
        marginBottom: 30,
    },
    progressContainer: {
        width: '100%',
        height: 10,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBar: {
        height: '100%',
        backgroundColor: Colors.accent,
    },
    progressLabel: {
        fontSize: 14,
        color: Colors.text,
        marginBottom: 20,
        alignSelf: 'flex-start',
    },
});

export default HomeScreen;
