import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import Colors from '../constants/colors';
import Button from '../components/Button';

type RootStackParamList = {
    Profile: undefined;
};

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const profile = useSelector((state: RootState) => {
        const p = state.user.profile;
        return p ? {...p, birthday: new Date(p.birthday)} : null;
    });

    console.log('Profile from redux', profile);

    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        setCurrentDate(date);
    }, []);

    if (!profile) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: Colors.background }} contentContainerStyle={styles.container}>
            <Text style={styles.welcome}>Welcome, {profile.name}!</Text>
            <Text style={styles.date}>{currentDate}</Text>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: '80%' }]} />
            </View>
            <Text style={styles.progressLabel}>Profile completion: 80%</Text>
            <Button title="Go to your profile!" onPress={() => navigation.navigate('Profile')} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        color: Colors.text,
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
