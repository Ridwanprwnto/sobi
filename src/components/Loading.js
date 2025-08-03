// components/LoadingMain.js
import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet} from 'react-native';

const LoadingMain = ({text}) => (
  <View style={styles.loadingOverlay}>
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#6366f1" />
      <Text style={styles.loadingText}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingContainer: {
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#1e293b',
  },
});

export default LoadingMain;
