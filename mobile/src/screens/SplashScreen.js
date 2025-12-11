import React from 'react';
import {View, Text, StyleSheet, ActivityIndicator} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VibeMatch</Text>
      <ActivityIndicator size="large" color="#8B5CF6" style={styles.loader} />
      <Text style={styles.tagline}>Find your perfect match</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginBottom: 20,
  },
  loader: {
    marginVertical: 20,
  },
  tagline: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 10,
  },
});

