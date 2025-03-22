import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { colors, typography, spacing } from '../../styles';

const Button = ({ 
  mode = 'contained', 
  onPress, 
  children, 
  style, 
  labelStyle, 
  loading = false,
  disabled = false,
  icon,
  ...props 
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      style={[
        styles.button,
        mode === 'outlined' && styles.outlined,
        mode === 'text' && styles.text,
        disabled && styles.disabled,
        style,
      ]}
      labelStyle={[
        styles.label,
        mode === 'outlined' && styles.outlinedLabel,
        mode === 'text' && styles.textLabel,
        labelStyle,
      ]}
      loading={loading}
      disabled={disabled}
      icon={icon}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginVertical: spacing.small,
  },
  outlined: {
    borderColor: colors.primary,
    borderWidth: 1,
  },
  text: {
    backgroundColor: 'transparent',
    paddingHorizontal: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: typography.fontSize.medium,
    fontWeight: typography.fontWeight.medium,
  },
  outlinedLabel: {
    color: colors.primary,
  },
  textLabel: {
    color: colors.primary,
  },
});

export default Button; 