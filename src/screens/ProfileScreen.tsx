import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Image, ActivityIndicator, Alert, ScrollView} from 'react-native';
import {SafeAreaView} from "react-native-safe-area-context";
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

import Colors from '../constants/colors';
import { fetchProfile } from '../mock/user';
import type { UserProfile } from '../mock/user';
import Button from '../components/Button';



const ProfileScreen = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

    const loadProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchProfile();
            setProfile(data);
        } catch (err) {
            setError('Failed to load profile.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const handleEdit = () => {
       navigation.navigate('ProfileEdit')
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.accent} />
            </View>
        );
    }

    if (error || !profile) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>{error ?? 'No profile data.'}</Text>
                <Button title="Retry" onPress={loadProfile}/>
            </View>
        );
    }

    return (
        <SafeAreaView style={{flex:1,backgroundColor:Colors.background}}>
            <ScrollView style={{flex:1}} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" >
            <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.email}>{profile.email}</Text>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Bio:</Text>
                <Text style={styles.value}>{profile.bio}</Text>
            </View>

            <View style={styles.fieldGroup}>
                <Text style={styles.label}>Birthday:</Text>
                <Text style={styles.value}>
                    {new Date(profile.birthday).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Text>
            </View>

            <View style={{ marginTop: 24 }}>
                <Button title="Edit Profile" onPress={handleEdit} />
            </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 16,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: Colors.mutedText,
        marginBottom: 16,
    },
    fieldGroup: {
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    label: {
        fontWeight: 'bold',
        color: Colors.text,
    },
    value: {
        color: Colors.mutedText,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginBottom: 16,
    },
});

export default ProfileScreen;
