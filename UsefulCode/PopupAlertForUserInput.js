import React, { useState } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';

const MyComponent = () => {
  const [name, setName] = useState('');

  const handlePrompt = () => {
    Alert.prompt(
      'Enter your name',
      null,
      (value) => setName(value),
      undefined,
      'default'
    );
  };

  return (
    <View style={styles.container}>
      <Text>Your name is: {name}</Text>
      <Button title="Enter name" onPress={handlePrompt} />
    </View>
  );
};

export default MyComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
  },
});