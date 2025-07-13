import React, { useState } from 'react';
import {View, Text, StyleSheet, TextInput, Alert, ScrollView, Image, TouchableOpacity, Platform, KeyboardAvoidingView,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setProfile } from '../store/userSlice';


import Colors from '../constants/colors';
import Button from '../components/Button';
import {updateProfile, UserProfile} from '../mock/user';

import type { AppDispatch } from '../store';


type ProfileFormValues = {
    name: string;
    email: string;
    bio?: string;
    birthday: Date;
};

const schema: yup.ObjectSchema<ProfileFormValues> = yup.object({
    name: yup
        .string()
        .required('Name is required')
        .matches(/^[A-Za-z\s]+$/, 'Only letters and spaces allowed')
        .min(2, 'Name must be at least 2 letters')
        .max(50),
    email: yup.string().required('Email is required').email('Invalid email format'),
    bio: yup.string().max(200, 'Max 200 characters').optional(),
    birthday: yup.date().required(),
});

const ProfileEditScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { profile } = route.params as { profile: UserProfile };
    const dispatch = useDispatch<AppDispatch>();


    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date(profile.birthday));
    const [loading, setLoading] = useState(false);

    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm<ProfileFormValues>({
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

    const onSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        try {
            setLoading(true);
            const updated = await updateProfile(data);

            dispatch(setProfile({
                ...updated,
                birthday: updated.birthday.toISOString(), // serialize Date → string
            }));

            navigation.goBack();
        } catch (err) {
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 60 }]}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={{ flexGrow: 1 }}>
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarContainer}>
                                <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
                                <TouchableOpacity style={styles.changeOverlay}>
                                    <Text style={styles.changeText}>Change Photo</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Name</Text>
                            <Controller
                                control={control}
                                name="name"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                                        placeholder="Name"
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => {
                                            setFocusedField(null);
                                            onBlur();
                                        }}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <Controller
                                control={control}
                                name="email"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[styles.input, focusedField === 'email' && styles.inputFocused]}
                                        placeholder="Email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => {
                                            setFocusedField(null);
                                            onBlur();
                                        }}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Bio</Text>
                            <Controller
                                control={control}
                                name="bio"
                                render={({ field: { onChange, onBlur, value } }) => (
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { height: 80, textAlignVertical: 'top' },
                                            focusedField === 'bio' && styles.inputFocused,
                                        ]}
                                        placeholder="Bio"
                                        multiline
                                        maxLength={200}
                                        onFocus={() => setFocusedField('bio')}
                                        onBlur={() => {
                                            setFocusedField(null);
                                            onBlur();
                                        }}
                                        onChangeText={onChange}
                                        value={value}
                                    />
                                )}
                            />
                            <Text style={styles.counter}>{bioValue.length}/200</Text>
                            {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Birthday</Text>
                            <Controller
                                control={control}
                                name="birthday"
                                render={({ field: { value, onChange } }) => (
                                    <>
                                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                            <Text style={styles.dateText}>
                                                {value ? new Date(value).toLocaleDateString() : 'Select date'}
                                            </Text>
                                        </TouchableOpacity>

                                        {showDatePicker && (
                                            <>
                                                <DateTimePicker
                                                    value={tempDate}
                                                    mode="date"
                                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                    onChange={(event, selectedDate) => {
                                                        if (Platform.OS === 'ios') {
                                                            if (selectedDate) {
                                                                setTempDate(selectedDate);
                                                            }
                                                        } else {
                                                            setShowDatePicker(false);
                                                            if (event.type === 'set' && selectedDate) {
                                                                onChange(selectedDate);
                                                            }
                                                        }
                                                    }}
                                                />
                                                {Platform.OS === 'ios' && (
                                                    <View style={styles.iosPickerActions}>
                                                        <Button title="Cancel" onPress={() => setShowDatePicker(false)} />
                                                        <Button
                                                            title="Confirm"
                                                            onPress={() => {
                                                                onChange(tempDate);
                                                                setShowDatePicker(false);
                                                            }}
                                                        />
                                                    </View>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                            />
                            {errors.birthday && <Text style={styles.error}>{errors.birthday.message}</Text>}
                        </View>

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
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        backgroundColor: Colors.background,
        flexGrow: 1,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 6,
        fontWeight: 'bold',
        color: Colors.mutedText,
        fontSize: 14,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: 'white',
        color: Colors.text,
    },
    inputFocused: {
        borderColor: Colors.accent,
        shadowColor: Colors.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarWrapper: {
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
        marginTop: 4,
    },
    counter: {
        alignSelf: 'flex-end',
        marginTop: 4,
        color: Colors.mutedText,
        fontSize: 12,
    },
    dateInput: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
    },
    dateText: {
        color: Colors.text,
    },
    iosPickerActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        gap: 12,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
    },
});

export default ProfileEditScreen;
