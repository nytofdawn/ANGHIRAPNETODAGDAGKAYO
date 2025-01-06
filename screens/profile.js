import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from 'expo-linear-gradient';
import Layout from "../Navigation/layout";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icon library

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await AsyncStorage.getItem('userData');
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
      <LinearGradient colors={['white', 'white']} style={styles.container}>
        <View style={styles.header}>
          <Icon name="user" size={100} color="black" style={styles.profileImage} />
          <Text style={styles.headerText}>PROFILE</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.textT}>Welcome, {userData?.first_name} {userData?.last_name}!</Text>
          {/* Add employee_number below Welcome text */}
          <Text style={styles.employeeNumberText}>Employee Number: {userData?.employee_number}</Text>
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
    backgroundColor: '#FFA580',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
  profileImage: {
    marginBottom: 15,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  textT:{
    fontSize: 30,
    fontWeight: 'bold',
    fontStyle:'italic',
    color: 'black',
  },
  employeeNumberText: {
    fontSize: 18,
    color: 'black',
    marginVertical: 10,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  logoutButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    padding: 12,
    backgroundColor: '#FF4500',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fff',
    marginBottom:80
  },
  logoutText: {
    fontSize: 18,
    color: '#fff',
  },
});

export default Profile;
