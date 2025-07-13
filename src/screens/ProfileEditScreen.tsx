import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    ScrollView,
    Image,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation } from '@react-navigation/native';
import { usePreventRemove } from '@react-navigation/native';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import Colors from '../constants/colors';
import Button from '../components/Button';
import { updateProfile, uploadProfilePicture } from '../mock/user';
import { RootState, AppDispatch } from '../store';
import { setProfile } from '../store/userSlice';

/**
 * Schema validation for the profile form
 */
const schema = yup.object({
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

/**
 * Profile Edit Screen
 */
const ProfileEditScreen = () => {
    const profile = useSelector((state: RootState) => state.user.profile);
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    /**
     * Prevent usage before profile is loaded
     */

    if (!profile) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    /**
     * Local UI state
     */
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [tempDate, setTempDate] = useState<Date>(new Date(profile.birthday));
    const [loading, setLoading] = useState(false);
    const [skipUnsavedWarning, setSkipUnsavedWarning] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    /**
     * Form hook
     */
    const {
        control,
        handleSubmit,
        watch,
        formState: { errors, isValid, isDirty },
    } = useForm({
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

    /**
     * Confirm before navigation if there are unsaved changes
     */
    usePreventRemove(isDirty && !skipUnsavedWarning, (e) => {
        Alert.alert(
            'Discard changes?',
            'You have unsaved changes. Are you sure you want to leave?',
            [
                { text: 'Stay', style: 'cancel' },
                {
                    text: 'Discard',
                    style: 'destructive',
                    onPress: () => navigation.dispatch(e.data.action),
                },
            ]
        );
    });

    /**
     * Media permissions
     */
    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'Camera roll access is needed to change your profile picture.');
            }
        })();
    }, []);

    /**
     * Profile picture upload handler
     */
    const handleChangePhoto = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled) return;
        const uri = result.assets[0].uri;

        try {
            setUploading(true);
            setUploadProgress(0);

            const uploadedUrl = await uploadProfilePicture(uri, (progress) => setUploadProgress(progress));

            dispatch(setProfile({
                ...profile,
                profilePicture: uploadedUrl,
            }));
        } catch {
            Alert.alert('Error', 'Failed to upload profile picture.');
        } finally {
            setUploading(false);
        }
    };

    /**
     * Submit handler
     */
    const onSubmit: SubmitHandler<any> = async (data) => {
        try {
            setSkipUnsavedWarning(true);
            setLoading(true);

            const updated = await updateProfile(data);
            dispatch(setProfile({
                ...updated,
                birthday: updated.birthday.toISOString(),
            }));
            navigation.goBack();
        } catch {
            Alert.alert('Error', 'Failed to save changes');
        } finally {
            setLoading(false);
            setSkipUnsavedWarning(false);
        }
    };

    /**
     * UI Rendering
     */
    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>

                <ScrollView
                    style={{ flex: 1 }}
                    contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 100 }]}
                    keyboardShouldPersistTaps="handled">

                    {/* Avatar */}
                    <View style={styles.avatarWrapper}>
                        <View style={styles.avatarContainer}>
                            <Image source={{ uri: profile.profilePicture }} style={styles.avatar} />
                            <TouchableOpacity style={styles.changeOverlay} onPress={handleChangePhoto}>
                                <Text style={styles.changeText}>
                                    {uploading ? `Uploading... ${uploadProgress}%` : 'Change Photo'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Name Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name</Text>
                        <Controller
                            control={control}
                            name="name"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, focusedField === 'name' && styles.inputFocused]}
                                    placeholder="Name"
                                    value={value}
                                    onChangeText={onChange}
                                    onFocus={() => setFocusedField('name')}
                                    onBlur={() => {
                                        setFocusedField(null);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                        {errors.name && <Text style={styles.error}>{errors.name.message}</Text>}
                    </View>

                    {/* Email Field */}
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
                                    value={value}
                                    onChangeText={onChange}
                                    onFocus={() => setFocusedField('email')}
                                    onBlur={() => {
                                        setFocusedField(null);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                        {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}
                    </View>

                    {/* Bio Field */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <Controller
                            control={control}
                            name="bio"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    style={[styles.input, { height: 80, textAlignVertical: 'top' }, focusedField === 'bio' && styles.inputFocused]}
                                    placeholder="Bio"
                                    multiline
                                    maxLength={200}
                                    value={value}
                                    onChangeText={onChange}
                                    onFocus={() => setFocusedField('bio')}
                                    onBlur={() => {
                                        setFocusedField(null);
                                        onBlur();
                                    }}
                                />
                            )}
                        />
                        <Text style={styles.counter}>{bioValue.length}/200</Text>
                        {errors.bio && <Text style={styles.error}>{errors.bio.message}</Text>}
                    </View>

                    {/* Birthday */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Birthday</Text>
                        <Controller
                            control={control}
                            name="birthday"
                            render={({ field: { value, onChange } }) => (
                                <>
                                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                                        <Text style={styles.dateText}>{new Date(value).toLocaleDateString()}</Text>
                                    </TouchableOpacity>

                                    {showDatePicker && (
                                        <>
                                            <DateTimePicker
                                                value={tempDate}
                                                mode="date"
                                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                                onChange={(event, selectedDate) => {
                                                    if (Platform.OS === 'ios') {
                                                        if (selectedDate) setTempDate(selectedDate);
                                                    } else {
                                                        setShowDatePicker(false);
                                                        if (event.type === 'set' && selectedDate) onChange(selectedDate);
                                                    }
                                                }}
                                            />
                                            {Platform.OS === 'ios' && (
                                                <View style={styles.iosPickerActions}>
                                                    <Button title="Cancel" onPress={() => setShowDatePicker(false)} />
                                                    <Button title="Confirm" onPress={() => { onChange(tempDate); setShowDatePicker(false); }} />
                                                </View>
                                            )}
                                        </>
                                    )}
                                </>
                            )}
                        />
                        {errors.birthday && <Text style={styles.error}>{errors.birthday.message}</Text>}
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonRow}>
                        <Button title="Cancel" onPress={() => navigation.goBack()} style={{ flex: 1, marginRight: 8 }} />
                        <Button title="Save" onPress={handleSubmit(onSubmit)} disabled={!isDirty || !isValid} style={{ flex: 1 }} />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};

/**
 * Styles
 */
const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 24,
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
