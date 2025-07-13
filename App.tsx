import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';

import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import { store } from './src/store';
import { fetchProfile } from './src/mock/user';
import { setProfile } from './src/store/userSlice';
import type { AppDispatch } from './src/store';

const LoadProfileWrapper = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUser = async () => {
            const user = await fetchProfile();

            dispatch(
                setProfile({
                    ...user,
                    birthday: user.birthday.toISOString(), // Serialized
                })
            );
        };
        loadUser();
    }, [dispatch]);

    return <>{children}</>;
};

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
