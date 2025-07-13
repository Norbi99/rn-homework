import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

export const usePushPermissionRequest = () => {
    useEffect(() => {
        const requestPermission = async () => {
            const settings = await Notifications.getPermissionsAsync();

            if (!settings.granted) {
                const response = await Notifications.requestPermissionsAsync();
                if (!response.granted) {
                    Alert.alert(
                        'Permission required',
                        'Push notifications are disabled. You can enable them in Settings.'
                    );
                }
            }
        };

        if (Platform.OS !== 'web') {
            requestPermission();
        }
    }, []);
};
