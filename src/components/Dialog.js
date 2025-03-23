import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Dialog as PaperDialog, Portal, Text } from 'react-native-paper';
import { colors, borderRadius, typography } from '../styles/common';
import { useTheme } from '../contexts/ThemeContext';

const DialogComponent = ({ 
  visible, 
  title, 
  content, 
  onCancel, 
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Confirm'
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <Portal>
      <PaperDialog visible={visible} onDismiss={onCancel} style={styles.dialog}>
        <PaperDialog.Title style={styles.dialogTitle}>{title}</PaperDialog.Title>
        
        {content && (
          <PaperDialog.Content>
            <Text style={styles.dialogContent}>{content}</Text>
          </PaperDialog.Content>
        )}
        
        <PaperDialog.Actions>
          <Button 
            onPress={onCancel} 
            color={colors.accent}
            style={styles.dialogActionButton}
            labelStyle={[styles.dialogActionButtonText, { color: isDarkMode ? colors.black : colors.white }]}
            mode="contained"
          >
            {cancelText}
          </Button>
          <Button 
            onPress={onConfirm} 
            color={colors.accent}
            style={styles.dialogActionButton}
            labelStyle={[styles.dialogActionButtonText, { color: isDarkMode ? colors.black : colors.white }]}
            mode="contained"
          >
            {confirmText}
          </Button>
        </PaperDialog.Actions>
      </PaperDialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    borderRadius: borderRadius.large,
    backgroundColor: colors.surface,
  },
  dialogTitle: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  dialogContent: {
    color: colors.text,
  },
  dialogActionButton: {
    marginHorizontal: 8,
    paddingHorizontal: 12,
    borderRadius: borderRadius.small,
  },
  dialogActionButtonText: {
    fontWeight: typography.fontWeight.bold,
  }
});

export default DialogComponent; 