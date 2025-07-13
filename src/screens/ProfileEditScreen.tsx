import React from 'react';
import {View, Text, StyleSheet, TextInput, Alert, ScrollView, Image, TouchableOpacity,} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Colors from '../constants/colors';
import Button from '../components/Button';
import type { UserProfile } from '../mock/user';

type ProfileFormValues = {
    name: string;
    email: string;
    bio?: string;
    birthday: Date;
};

const schema: yup.ObjectSchema<ProfileFormValues> = yup.object({
    name: yup.string().required('Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
        .min(2, "Name must be at least 2 letters")
        .max(50),
    email: yup
        .string()
        .required('Email is required')
        .email('Invalid email format'),
    bio: yup.string().max(200, 'Max 200 characters').optional(),
    birthday: yup.date().required(),
});

const ProfileEditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { profile } = route.params as { profile: UserProfile };

    const {control, handleSubmit, watch, formState: { errors, isValid, isDirty }} = useForm<ProfileFormValues>({
        defaultValues: {
            name: profile.name,
            email: profile.email,
            bio: profile.bio,
            birthday: new Date(profile.birthday),
        },
        resolver: yupResolver(schema),
        mode: 'onChange',
    });

    const bioValue = watch('bio') ?? '';

    const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
        console.log('Form data:', data);
        Alert.alert('Submitted!', JSON.stringify(data, null, 2));
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.avatarWrapper}>
                <View style={styles.avatarContainer}>
                    <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
                    <TouchableOpacity style={styles.changeOverlay}>
                        <Text style={styles.changeText}>Change Photo</Text>
                    </TouchableOpacity>
                </View>
            </View>



            <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Name"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}

            <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

            <Controller
                control={control}
                name="bio"
                render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                        style={[styles.input, { height: 80 }]}
                        placeholder="Bio"
                        multiline
                        maxLength={200}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                    />
                )}
            />
            <Text style={styles.counter}>{bioValue.length}/200</Text>
            {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}

            {/* todo Date picker implementation */}

            <View style={styles.buttonRow}>
                <Button
                    title="Cancel"
                    onPress={() => navigation.goBack()}
                    style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                    title="Save"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isDirty || !isValid}
                    style={{ flex: 1 }}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: Colors.background,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        backgroundColor: 'white',
        color: Colors.text,
    },avatarWrapper: {
        alignItems: 'center',
        marginBottom: 24,
    },

    avatarContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
        position: 'relative',
    },

    avatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },

    changeOverlay: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    changeText: {
        color: '#fff',
        fontSize: 12,
    },



    error: {
        color: 'red',
        marginBottom: 8,
    },
    counter: {
        alignSelf: 'flex-end',
        marginBottom: 12,
        color: Colors.mutedText,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
});

export default ProfileEditScreen;
