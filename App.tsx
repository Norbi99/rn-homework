import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoadProfileWrapper from "./src/wrappers/LoadProfileWrapper";
import { store } from './src/store';
import {usePushPermissionRequest} from "./src/hooks/usePushPermissionRequest";


export default function App() {
    usePushPermissionRequest();
    return (
        <Provider store={store}>
            <NavigationContainer>
                <LoadProfileWrapper>
                    <BottomTabNavigator />
                </LoadProfileWrapper>
            </NavigationContainer>
        </Provider>
    );
}
