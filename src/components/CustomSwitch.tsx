import React from 'react';
import { Switch, Platform } from 'react-native';
import Colors from '../constants/colors';

type CustomSwitchProps = {
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
};

const CustomSwitch: React.FC<CustomSwitchProps> = ({ value, onValueChange, disabled = false }) => {
    return (
        <Switch
            value={value}
            onValueChange={onValueChange}
            disabled={disabled}
            trackColor={{ false: '#d3d3d3', true: Colors.accent }}
            thumbColor={Platform.OS === 'android' ? (value ? '#fff' : '#f1f1f1') : undefined}
        />
    );
};

export default CustomSwitch;
