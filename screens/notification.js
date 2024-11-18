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
    const fetchNotifications = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const token = parsedUserData.token;
          const fullName = `${parsedUserData.first_name} ${parsedUserData.last_name}`;

          if (token) {
            setUserName(fullName);

            // Fetch payroll notifications from the API
            const response = await axios.get(API_URL, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            // Filter payroll notifications for the logged-in user
            const payrollNotifications = response.data.filter(item => item.employee.full_name === fullName);
            setNotifications(payrollNotifications);
          } else {
            console.error("No token found in AsyncStorage");
          }
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
        Alert.alert("Error", "Failed to load notifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationPress = async (notification) => {
    const netSalary = notification.net_salary && !isNaN(notification.net_salary) ? parseFloat(notification.net_salary) : 0;

    setNotifications(prevNotifications =>
      prevNotifications.map(item =>
        item.id === notification.id ? { ...item, is_read: true } : item
      )
    );

    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        const token = parsedUserData.token;

        if (token) {
          await axios.patch(
            `http://192.168.100.154:8000/api/payroll/${notification.id}/`,
            { is_read: true },
            {
              headers: {
                Authorization: `Token ${token}`,
              },
            }
          );
        }
      }
    } catch (error) {
      console.error("Error marking payroll as read:", error);
      Alert.alert("Error", "Failed to update notification status. Please try again later.");
    }

    // Display payday alert
    Alert.alert(
      "PAYDAY",
      `Payday na! Your net salary is ₱${netSalary.toFixed(2)}. Don't forget to manage your finances!`
    );
  };

  const handleOldNotificationPress = async (notification) => {
    try {
      // Extracting the payment date (end_date) from the notification
      const paymentDate = notification.end_date;
  
      // Parsing the net salary to a number if valid
      const amount = notification.net_salary && !isNaN(notification.net_salary) 
        ? parseFloat(notification.net_salary) 
        : 0;
  
      // Creating the updated notification object with paymentDate and amount
      const notificationWithPaymentDetails = {
        ...notification,
        paymentDate: paymentDate, // Using the end_date as paymentDate
        amount: amount,           // Setting the net_salary as Amount
      };
  
      // Fetching the existing PayHistory from AsyncStorage
      const payHistoryData = await AsyncStorage.getItem('PayHistory');
      const payHistory = payHistoryData ? JSON.parse(payHistoryData) : [];
  
      // Adding the new notification with payment details to the history
      const updatedPayHistory = [...payHistory, notificationWithPaymentDetails];
  
      // Saving the updated PayHistory back to AsyncStorage
      await AsyncStorage.setItem('PayHistory', JSON.stringify(updatedPayHistory));
  
      // Show a success message
      Alert.alert("Success", "Notification saved to PayHistory with Payment Date and Amount.");
    } catch (error) {
      // Handle any errors
      console.error("Error saving to PayHistory:", error);
      Alert.alert("Error", "Failed to save notification to PayHistory.");
    }
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
      <LinearGradient colors={['white', 'white']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Notifications</Text>
        </View>

        <View style={styles.contentContainer}>
          <Text style={styles.text}>PAYDAY</Text>

          {notifications.length > 0 ? (
            <View style={styles.newNotificationsContainer}>
              {notifications.filter(notification => !notification.is_read).map((notification, index) => {
                const netSalary = notification.net_salary && !isNaN(notification.net_salary) ? parseFloat(notification.net_salary) : 0;

                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.notificationCard}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <Text style={styles.notificationText}>
                      {notification.message || `Payroll for ${notification.employee.full_name} is available. Net Salary: ₱${netSalary.toFixed(2)}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <Text>No new payroll notifications available.</Text>
          )}

          <View style={styles.oldNotificationsContainer}>
            <Text style={styles.oldText}>History</Text>
            {notifications.filter(notification => notification.is_read).length > 0 ? (
              notifications.filter(notification => notification.is_read).map((notification, index) => {
                const netSalary = notification.net_salary && !isNaN(notification.net_salary) ? parseFloat(notification.net_salary) : 0;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.notificationCard}
                    onPress={() => handleOldNotificationPress(notification)}
                  >
                    <Text style={styles.notificationText}>
                      {notification.message || `Payroll for ${notification.employee.full_name} was processed. with ₱${netSalary.toFixed(2)}`}
                    </Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Text>No old notifications available.</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',  // Set background to white
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // Add shadow for Android
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
  newNotificationsContainer: {
    marginBottom: 20,
  },
  oldNotificationsContainer: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  oldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notificationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 3, // Add shadow for Android
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default NotificationDashboard;
