import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, borderRadius, shadowStyles } from '../../styles';

const Card = ({ children, style, elevation = 1 }) => {
  const cardElevation = elevation === 1 ? shadowStyles.small : 
                       elevation === 2 ? shadowStyles.medium : 
                       shadowStyles.large;
  
  return (
    <View style={[styles.card, cardElevation, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.medium,
    padding: 16,
    margin: 8,
  },
});

export default Card; 