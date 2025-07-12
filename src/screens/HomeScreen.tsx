import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { fetchProfile, UserProfile } from '../mock/user';
import Colors from '../constants/colors';

type RootStackParamList = {
    Profile: undefined;
};

const HomeScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const [user, setUser] = useState<UserProfile | null>(null);
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const loadUser = async () => {
            const data = await fetchProfile();
            setUser(data);
        };

        const date = new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        setCurrentDate(date);
        loadUser();
    }, []);

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.welcome}>Welcome, {user.name}!</Text>
            <Text style={styles.date}>{currentDate}</Text>

            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: '80%' }]} />
            </View>
            <Text style={styles.progressLabel}>Profile completion: 80%</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.link}>Edit your profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    text: {
        fontSize: 16,
        color: Colors.text
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
    card: {
        backgroundColor: Colors.card,
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        width: '100%',
    },
    cardText: {
        fontSize: 16,
        color: Colors.text,
    },
    link: {
        fontSize: 16,
        color: Colors.accent,
        textDecorationLine: 'underline',
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
    }

});

export default HomeScreen;
