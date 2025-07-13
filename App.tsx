import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import LoadProfileWrapper from "./src/wrappers/LoadProfileWrapper";
import { store } from './src/store';


export default function App() {
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
