import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootState } from '../store';
import type { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

import Colors from '../constants/colors';
import Button from '../components/Button';
import Card from '../components/Card';

const ProfileScreen = () => {
    /**
     * Navigation setup
     */
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

    /**
     * Select user profile from Redux
     */
    const profile = useSelector((state: RootState) => state.user.profile);

    /**
     * Navigate to ProfileEdit screen
     */
    const handleEdit = () => {
        if (profile) {
            navigation.navigate('ProfileEdit');
        }
    };

    /**
     * Show loading indicator while profile is not available
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
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Card style={styles.card}>
                    <Image
                        source={{ uri: profile.profilePicture || 'https://i.pravatar.cc/150?img=12' }}
                        style={styles.avatar}
                    />

                    <Text style={styles.name}>{profile.name}</Text>
                    <Text style={styles.email}>{profile.email}</Text>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Bio:</Text>
                        <Text style={styles.value}>{profile.bio}</Text>
                    </View>

                    <View style={styles.fieldGroup}>
                        <Text style={styles.label}>Birthday:</Text>
                        <Text style={styles.value}>
                            {profile.birthday
                                ? new Date(profile.birthday).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })
                                : 'N/A'}
                        </Text>
                    </View>

                    <Button title="Edit your profile!" onPress={handleEdit} style={{ marginTop: 24 }} />
                </Card>
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
    card: {
        width: '100%',
        alignItems: 'center',
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
});

export default ProfileScreen;
