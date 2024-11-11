import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');


  const handleForgotPassword = () => {
    const normalizedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    Alert.alert('Success', 'A password reset link has been sent to your email');
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#FFA500', '#FF4500']}
      style={styles.container}
    >
      <Text style={styles.title}>Forgot Password</Text>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        
        <Button title="Submit" onPress={handleForgotPassword} />

        <Text style={styles.switchText}>
          Remember your password?{' '}
          <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
            Login here
          </Text>
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'white',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default ForgotPasswordScreen;
