import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!employeeId || !password) {
      Alert.alert('Error', 'Please enter both Employee ID and Password');
      return;
    }
    try {
      const response = await axios.post('http://192.168.100.154:8000/api/login/', {
        employee_number: employeeId,
        password: password,
      });
      if (response.status === 200) {
        await AsyncStorage.setItem('userData', JSON.stringify(response.data));
  
        Alert.alert('Login Successful', 'Welcome to the Dashboard!', [
          { text: 'OK', onPress: () => navigation.navigate('Dashboard') }
        ]);
        console.log('Login successful:', response.data);
      } else if (response.status === 401) {
        Alert.alert('Login Failed', 'Invalid employee number or password', [
          { text: 'Try Again' }
        ]);
        console.log('Login failed: Invalid credentials');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', 'Check your credentials, or internet connection');
      } else {
        Alert.alert('Network Error', 'There was an issue connecting. Please check your internet connection.');
      }
    }
  };
  

  return (
    <LinearGradient
      colors={['#FFA500', '#FF4500']}
      style={styles.container}
    >
      <Text style={styles.title}>Login</Text>

      <LinearGradient
        colors={['#FF4500', '#FFA500']}
        style={styles.loginContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Employee ID"
          keyboardType="number-pad"
          value={employeeId}
          onChangeText={setEmployeeId}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={handleLogin} />
        
        <Text style={styles.forgotPasswordText} onPress={() => navigation.navigate('ForgotPassword')}>
          Forgot your password?
        </Text>
      </LinearGradient>
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
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  loginContainer: {
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
    color: 'black',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  forgotPasswordText: {
    marginTop: 15,
    textAlign: 'center',
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;