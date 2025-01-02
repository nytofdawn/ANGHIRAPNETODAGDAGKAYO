import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, StyleSheet, Alert, Image, View, BackHandler } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Are you sure?",
        "Do you want to exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "YES",
            onPress: () => BackHandler.exitApp()
          }
        ]
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    if (!employeeId || !password) {
      Alert.alert('Error', 'Please enter both Employee ID and Password');
      return;
    }
  
    try {
      const response = await axios.post('http://3.27.173.131/api/login/', {
        employee_number: employeeId,
        password: password,
      });
  
      if (response.status === 200) {
        const { employee_number, first_name, last_name, token, username } = response.data;
  
        const userData = {
          employee_number,
          first_name,
          last_name,
          token,
          username,
        };
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
  
        Alert.alert('Login Successful', 'Welcome to the Dashboard!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Dashboard'),
          },
        ]);
      } else if (response.status === 401) {
        Alert.alert('Login Failed', 'Invalid employee number or password', [
          { text: 'Try Again' },
        ]);
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again later.');
      }
    } catch (error) {
      if (error.response) {
        // Server error
        Alert.alert('Error', 'Check your credentials or internet connection');
      } else {
        // Network error
        Alert.alert('Network Error', 'There was an issue connecting. Please check your internet connection.');
      }
    }
  };
  

  return (
    <LinearGradient
      colors={['white', 'white']}
      style={styles.container}
    >
      <LinearGradient
        colors={['#FF4500', '#FFA500']}
        style={styles.LogoCon}
      >
        <Image
          source={require('./logo/qpl.png')}
          style={styles.image}
        />
      </LinearGradient>
      <Text style={styles.titleL}>Login</Text>

      <LinearGradient
        colors={['white', 'white']}
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
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    backgroundColor: 'white',
  },
  titleL: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic',
    fontSize: 40,
    color: 'black',
  },
  LogoCon: {
    shadowColor: 'orange',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 20,
    elevation: 20,
    borderBottomLeftRadius: 80,
    borderBottomRightRadius: 80,
  },
  loginContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 8,
    shadowRadius: 20,
    elevation: 20,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 60,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingLeft: 10,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  switchText: {
    marginTop: 20,
    textAlign: 'center',
    color: 'black',
  },
});

export default LoginScreen;
