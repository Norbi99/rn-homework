import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoadProfileWrapper from './src/wrappers/LoadProfileWrapper';
import { store } from './src/store';
import { usePushPermissionRequest } from './src/hooks/usePushPermissionRequest';

export default function App() {
    usePushPermissionRequest();

    return (
        <Provider store={store}>
            <SafeAreaProvider>
                <NavigationContainer>
                    <LoadProfileWrapper>
                        <BottomTabNavigator />
                        <Toast topOffset={60} />
                    </LoadProfileWrapper>
                </NavigationContainer>
            </SafeAreaProvider>
        </Provider>
    );
}
