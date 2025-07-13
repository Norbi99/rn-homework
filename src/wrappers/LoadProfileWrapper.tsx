import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProfile } from '../mock/user';
import { setProfile } from '../store/userSlice';
import type { AppDispatch } from '../store';

const LoadProfileWrapper = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const loadUser = async () => {
            const user = await fetchProfile();
            dispatch(
                setProfile({
                    ...user,
                    birthday: user.birthday.toISOString(),
                })
            );
        };

        loadUser();
    }, [dispatch]);

    return <>{children}</>;
};

export default LoadProfileWrapper;
