import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import type { RootState } from '../store';
import type { ProfileStackParamList } from '../navigation/ProfileStackNavigator';

import Colors from '../constants/colors';
import Button from '../components/Button';

const ProfileScreen = () => {
    const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
    const profile = useSelector((state: RootState) => state.user.profile);


    const handleEdit = () => {
        if (profile) {
            navigation.navigate('ProfileEdit');
        }
    };

    if (!profile) {
        return (
            <View style={styles.centered}>
                <Text style={styles.error}>No profile data.</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <Image source={{ uri: profile.profilePicture || 'https://i.pravatar.cc/150?img=12'}} style={styles.avatar} />
                <Text style={styles.name}>{profile.name}</Text>
                <Text style={styles.email}>{profile.email}</Text>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Bio:</Text>
                    <Text style={styles.value}>{profile.bio}</Text>
                </View>

                <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Birthday:</Text>
                    <Text style={styles.value}>
                        {profile?.birthday ? new Date(profile.birthday).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }): 'N/A'}
                    </Text>
                </View>

                <View style={{ marginTop: 24 }}>
                    <Button title="Edit your profile!" onPress={handleEdit} />
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
