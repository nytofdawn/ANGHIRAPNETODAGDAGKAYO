import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Layout from "../Navigation/layout";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationDashboard = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState("");
  const API_URL = "http://192.168.100.154:8000/api/payroll/";

  useEffect(() => {
    AsyncStorage.getItem('userData')
      .then((userData) => {
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const token = parsedUserData.token;
          const fullName = `${parsedUserData.first_name} ${parsedUserData.last_name}`;

          
          if (token) {
            setUserName(fullName); 

           
            axios.get(API_URL, {
              headers: {
                Authorization: `Token ${token}`, 
              },
            })
              .then((response) => {
                const payrollNotifications = response.data.filter((item) => {
                  return item.employee.full_name === fullName;
                });

                if (payrollNotifications.length > 0) {
                  setNotifications(payrollNotifications);
                }
                setLoading(false);
              })
              .catch((error) => {
                console.error("Error fetching payroll data:", error);
                setLoading(false);
              });
          } else {
            console.error("No token found in AsyncStorage");
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error retrieving user data from AsyncStorage:", error);
        setLoading(false);
      });
  }, []);

  const handleNotificationPress = (notification) => {
    Alert.alert(
      "PAYDAY",
      `Payday na!, Wag kang magsashabu`, 
      [
        { text: "OK", onPress: () => handleDeleteNotification(notification.id) }
      ]
    );
  };

  const handleDeleteNotification = (notificationId) => {
    AsyncStorage.getItem('userData')
      .then((userData) => {
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const token = parsedUserData.token;
          if (token) {
            axios.delete(`${API_URL}${notificationId}/`, {
              headers: {
                Authorization: `Token ${token}`,
              }
            })
              .then((response) => {
                setNotifications(prevNotifications => prevNotifications.filter(notification => notification.id !== notificationId));
              })
              .catch((error) => {
                console.error("Error deleting notification:", error);
                Alert.alert("Error", "Failed to delete the notification.");
              });
          } else {
            console.error("Token is missing when trying to delete notification");
          }
        }
      })
      .catch((error) => {
        console.error("Error retrieving user data from AsyncStorage:", error);
        Alert.alert("Error", "Failed to retrieve user data.");
      });
  };

  if (loading) {
    return (
      <Layout navigation={navigation} activeTab="Notifications">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text>Loading...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="Notifications">
      <LinearGradient colors={['#FFA500', '#FF4500']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.text}>PAYDAY</Text>

          {notifications && notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <TouchableOpacity
                key={index}
                style={styles.notificationCard}
                onPress={() => handleNotificationPress(notification)}
              >
                <Text style={styles.notificationText}>
                  {notification.message || `Payroll for ${notification.employee.full_name} is available.`}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text>No new payroll notifications available.</Text>
          )}
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  notificationContainer: {
    marginBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default NotificationDashboard;
