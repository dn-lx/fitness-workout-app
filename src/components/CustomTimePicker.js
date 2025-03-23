import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { typography, spacing, borderRadius, colors as appColors } from '../styles';

const CustomTimePicker = ({ value, onChange }) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Parse the input time value (HH:MM format)
  const parseTimeValue = (timeString) => {
    const today = new Date();
    const [hours, minutes] = timeString.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today;
  };

  const [date, setDate] = useState(parseTimeValue(value));
  const [show, setShow] = useState(Platform.OS === 'ios');
  const [isAM, setIsAM] = useState(date.getHours() < 12);

  // Update internal date when value prop changes
  useEffect(() => {
    setDate(parseTimeValue(value));
    setIsAM(parseTimeValue(value).getHours() < 12);
  }, [value]);

  // Format time to string (HH:MM)
  const formatTimeToString = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleTimeChange = (event, selectedDate) => {
    if (selectedDate) {
      setDate(selectedDate);
      setIsAM(selectedDate.getHours() < 12);
      onChange(formatTimeToString(selectedDate));
    }
    
    if (Platform.OS === 'android') {
      setShow(false);
    }
  };

  // For Android, we need a button to show the picker
  const showTimePicker = () => {
    setShow(true);
  };

  const formatTimeDisplay = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Helper function to toggle between AM/PM
  const toggleAMPM = () => {
    const newDate = new Date(date);
    if (isAM) {
      // Convert to PM: Add 12 hours if not already PM and not 12 PM
      if (newDate.getHours() < 12) {
        newDate.setHours(newDate.getHours() + 12);
      }
    } else {
      // Convert to AM: Subtract 12 hours if not already AM and not 12 AM
      if (newDate.getHours() >= 12) {
        newDate.setHours(newDate.getHours() - 12);
      }
    }
    setDate(newDate);
    setIsAM(!isAM);
    onChange(formatTimeToString(newDate));
  };

  // Function to increment hours
  const incrementHour = () => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() + 1);
    setDate(newDate);
    setIsAM(newDate.getHours() < 12);
    onChange(formatTimeToString(newDate));
  };

  // Function to decrement hours
  const decrementHour = () => {
    const newDate = new Date(date);
    newDate.setHours(newDate.getHours() - 1);
    setDate(newDate);
    setIsAM(newDate.getHours() < 12);
    onChange(formatTimeToString(newDate));
  };

  // Function to increment minutes
  const incrementMinute = () => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + 1);
    setDate(newDate);
    onChange(formatTimeToString(newDate));
  };

  // Function to decrement minutes
  const decrementMinute = () => {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() - 1);
    setDate(newDate);
    onChange(formatTimeToString(newDate));
  };

  const get12HourFormat = (date) => {
    let hours = date.getHours();
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    return hours;
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.medium,
    },
    clockContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.large,
      padding: spacing.medium,
      elevation: 4,
      shadowColor: theme.dark ? '#000' : '#ccc',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme.dark ? 0.3 : 0.2,
      shadowRadius: 3,
      marginVertical: spacing.large,
      borderWidth: 1,
      borderColor: colors.outline,
    },
    timeSection: {
      alignItems: 'center',
      padding: spacing.small,
    },
    timeValue: {
      fontSize: 36,
      fontWeight: typography.fontWeight.bold,
      color: colors.primary,
      width: 60,
      textAlign: 'center',
    },
    colonText: {
      fontSize: 36,
      fontWeight: typography.fontWeight.bold,
      marginHorizontal: spacing.small,
      color: colors.primary,
    },
    amPmContainer: {
      marginLeft: spacing.medium,
      backgroundColor: isAM ? colors.primaryContainer : colors.secondaryContainer,
      borderRadius: borderRadius.medium,
      overflow: 'hidden',
    },
    amPmButton: {
      paddingVertical: spacing.small,
      paddingHorizontal: spacing.medium,
    },
    amPmText: {
      fontSize: typography.fontSize.medium,
      fontWeight: typography.fontWeight.bold,
      color: isAM ? colors.onPrimaryContainer : colors.onSecondaryContainer,
    },
    iconButton: {
      margin: 0,
    },
    picker: {
      width: '100%',
    },
    timeButton: {
      backgroundColor: colors.surface,
      paddingVertical: spacing.medium,
      paddingHorizontal: spacing.large,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      borderColor: colors.outline,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.medium,
      minWidth: 150,
    },
    timeText: {
      fontSize: typography.fontSize.large,
      color: colors.primary,
      fontWeight: typography.fontWeight.medium,
    }
  });

  // Render a custom clock UI for both platforms
  const renderCustomClock = () => (
    <View style={styles.clockContainer}>
      <View style={styles.timeSection}>
        <IconButton
          icon="chevron-up"
          size={24}
          onPress={incrementHour}
          style={styles.iconButton}
          color={colors.primary}
        />
        <Text style={styles.timeValue}>{get12HourFormat(date).toString().padStart(2, '0')}</Text>
        <IconButton
          icon="chevron-down"
          size={24}
          onPress={decrementHour}
          style={styles.iconButton}
          color={colors.primary}
        />
      </View>
      
      <Text style={styles.colonText}>:</Text>
      
      <View style={styles.timeSection}>
        <IconButton
          icon="chevron-up"
          size={24}
          onPress={incrementMinute}
          style={styles.iconButton}
          color={colors.primary}
        />
        <Text style={styles.timeValue}>{date.getMinutes().toString().padStart(2, '0')}</Text>
        <IconButton
          icon="chevron-down"
          size={24}
          onPress={decrementMinute}
          style={styles.iconButton}
          color={colors.primary}
        />
      </View>
      
      <TouchableOpacity style={styles.amPmContainer} onPress={toggleAMPM}>
        <View style={styles.amPmButton}>
          <Text style={styles.amPmText}>{isAM ? 'AM' : 'PM'}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {Platform.OS === 'android' && !show && (
        <TouchableOpacity 
          onPress={showTimePicker} 
          style={styles.timeButton}
        >
          <Text style={styles.timeText}>
            {formatTimeDisplay(date)}
          </Text>
        </TouchableOpacity>
      )}

      {Platform.OS === 'android' && !show && renderCustomClock()}

      {(show || Platform.OS === 'ios') && (
        <>
          {Platform.OS === 'ios' && renderCustomClock()}
          <DateTimePicker
            value={date}
            mode="time"
            is24Hour={false}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
            style={styles.picker}
            themeVariant={theme.dark ? 'dark' : 'light'}
          />
        </>
      )}
    </View>
  );
};

export default CustomTimePicker; 