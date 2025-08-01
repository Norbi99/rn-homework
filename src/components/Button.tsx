import React from 'react';
import {TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle, TextStyle,} from 'react-native';
import Colors from '../constants/colors';
import { ActivityIndicator } from 'react-native';


type ButtonProps = {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({title, onPress, variant = 'primary', disabled = false, style, textStyle, loading = false}) => {
    const isPrimary = (variant === 'primary');

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.base,
                isPrimary ? styles.primary : styles.secondary,
                (disabled || loading) && styles.disabled,
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={isPrimary ? Colors.text : Colors.mutedText} />
            ) : (
                <Text
                    style={[
                        styles.textBase,
                        isPrimary ? styles.primaryText : styles.secondaryText,
                        disabled && styles.disabledText,
                        textStyle,
                    ]}
                >
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );

};

const styles = StyleSheet.create({
    base: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    textBase: {
        fontSize: 14,
        fontWeight: '600',
    },
    primary: {
        backgroundColor: Colors.accent,
    },
    primaryText: {
        color: Colors.text,
    },
    secondary: {
        backgroundColor: Colors.card,
        borderWidth: 1,
        borderColor: Colors.accent,
    },
    secondaryText: {
        color: Colors.text,
    },
    disabled: {
        opacity: 0.6,
    },
    disabledText: {
        color: Colors.mutedText,
    },
});

export default Button;
