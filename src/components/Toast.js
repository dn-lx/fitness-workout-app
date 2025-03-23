import React from 'react';
import { Snackbar } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { colors } from '../styles/common';

const ShowToast = ({ visible, message, onDismiss, duration = 3000 }) => {
  return (
    <Snackbar
      visible={visible}
      onDismiss={onDismiss}
      duration={duration}
      style={styles.snackbar}
      action={{
        label: 'Dismiss',
        onPress: onDismiss,
      }}
    >
      {message}
    </Snackbar>
  );
};

const styles = StyleSheet.create({
  snackbar: {
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
});

export default ShowToast; 