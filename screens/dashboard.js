import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Layout from "../Navigation/layout";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // Fetch user data from AsyncStorage to retrieve the user's id
        const userData = await AsyncStorage.getItem('userData');
        if (!userData) {
          console.error("No user data found");
          return;
        }
  
        const parsedData = JSON.parse(userData);
        const userId = parsedData.employee_number;  
  
        const token = parsedData.token;
  
        const response = await fetch(`http://192.168.100.154:8000/api/attendance/`, {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
  
        if (!response.ok) {
          console.error("Error fetching attendance data:", response.statusText);
          return;
        }
  
        const data = await response.json();
  
        const filteredData = data.filter((attendanceEntry) => {
          return String(attendanceEntry.employee.id_number) === String(userId);
        });
  
  
        if (filteredData.length === 0) {
          setAttendanceData(null);
        } else {
          setAttendanceData(filteredData);
          await AsyncStorage.setItem('attendanceData', JSON.stringify(filteredData));
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage or API:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAttendanceData();
  }, []);
  
  

  if (loading) {
    return (
      <Layout navigation={navigation} activeTab="Home">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text>Loading...</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="Home">
      <LinearGradient colors={['#FFA500', '#FF4500']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Welcome to the Dashboard!</Text>

          <View style={styles.infoContainer}>
            {attendanceData ? (
              // Render all filtered attendance entries based on user 'id'
              attendanceData.map((entry, index) => (
                <View key={index} style={styles.timeContainer}>
                  <Text style={styles.infoText}>Employee: {entry.employee.full_name || "N/A"}</Text>
                  <Text style={styles.infoText}>Date: {entry.date || "N/A"}</Text>
                  <Text style={styles.infoText}>Time In: {entry.time_in || "N/A"}</Text>
                  <Text style={styles.infoText}>Time Out: {entry.time_out || "N/A"}</Text>
                  <Text style={styles.infoText}>Is Present: {entry.is_present ? 'Yes' : 'No'}</Text>
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No attendance records available</Text>
              </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  timeContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    padding: 15,
    margin: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#333',
  },
  emptyContainer: {
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
});

export default Dashboard;
