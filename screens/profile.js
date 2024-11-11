import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Layout from "../Navigation/layout";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
        const sakit = await AsyncStorage.getItem('attendanceData')
        if (data) {
          setUserData(JSON.parse(data));
        } else {
          Alert.alert('Error', 'No user data found.');
        }
      } catch (error) {
        console.error("Error retrieving user data", error);
        Alert.alert('Error', 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All AsyncStorage data cleared');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error logging out', error);
    }
  };
  

  const confirmLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Log Out", onPress: handleLogout, style: "destructive" }
      ],
      { cancelable: false }
    );
  };

  if (loading) {
    return (
      <Layout navigation={navigation} activeTab="Profile">
        <LinearGradient colors={['#FFA500', '#FF4500']} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Profile</Text>
          </View>
          <View style={styles.contentContainer}>
            <Text style={styles.text}>Loading user data...</Text>
          </View>
        </LinearGradient>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="Profile">
      <LinearGradient colors={['#FFA500', '#FF4500']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Profile</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Welcome, {userData?.first_name} {userData?.last_name}!</Text>
          <Text style={styles.text}>Username: {userData?.username}</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Profile;
