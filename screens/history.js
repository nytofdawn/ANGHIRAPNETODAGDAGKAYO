import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Layout from "../Navigation/layout"; // Assuming Layout is your navigation wrapper

const HistoryScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch PayHistory from AsyncStorage
    AsyncStorage.getItem('PayHistory')
      .then((storedHistory) => {
        if (storedHistory) {
          const parsedHistory = JSON.parse(storedHistory); // Parse the stored PayHistory
          console.log('Stored PayHistory:', parsedHistory); // Log history for debugging

          setHistory(parsedHistory); // Set the PayHistory data
        } else {
          setHistory([]); // If no PayHistory is found, set as an empty array
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error retrieving PayHistory:', error);
        setLoading(false);
      });
  }, []);

  const handleNotificationPress = (notification) => {
    // Optional: Behavior when a user taps on an item in history
    alert(`You tapped on ${notification.message}`);
  };

  // Safe function to handle salary formatting with fallback for invalid values
  const formatSalary = (netSalary) => {
    // Ensure netSalary is a valid number
    let salary = parseFloat(netSalary);

    // If salary is not a valid number, set it to 0
    if (isNaN(salary) || salary === null || salary === undefined) {
      salary = 0;
    }

    return salary.toFixed(2); // Format the salary to two decimal places
  };

  if (loading) {
    return (
      <Layout navigation={navigation} activeTab="History">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text>Loading history...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="History">
      <View style={styles.container}>
        <Text style={styles.header}>History of Payroll Notifications</Text>

        {history.length > 0 ? (
          <View style={styles.historyContainer}>
            {history.map((notification, index) => {
              // Logging to debug the net_salary value
              console.log('Net Salary for notification:', notification.net_salary);

              const netSalary = notification.net_salary;

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.notificationCard}
                  onPress={() => handleNotificationPress(notification)}
                >
                  <Text style={styles.notificationText}>
                    {notification.message || `Payroll for ${notification.employee.full_name} was processed. Net Salary: ₱${formatSalary(netSalary)}`}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text>No historical payroll notifications available.</Text>
        )}
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  historyContainer: {
    marginTop: 10,
  },
  notificationCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 3, // Optional shadow for Android
  },
  notificationText: {
    fontSize: 16,
    color: '#333',
  },
});

export default HistoryScreen;
