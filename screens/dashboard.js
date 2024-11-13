import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Layout from "../Navigation/layout";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = ({ navigation }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData?.token) return setLoading(false);

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(`http://192.168.1.42:8000/api/attendance/`, {
          method: 'GET',
          headers: { 'Authorization': `Token ${userData.token}` },
        });

        if (!response.ok) return setLoading(false);

        const data = await response.json();
        const filteredData = data.filter((entry) => String(entry.employee.id_number) === String(userData.employee_number));

        // Count attendance duplicates
        const attendanceCount = filteredData.reduce((acc, entry) => {
          const name = entry.employee.full_name;
          acc[name] = (acc[name] || 0) + 1;
          return acc;
        }, {});

        // Add attendance label for duplicates
        const attendanceWithCount = filteredData.map(entry => ({
          ...entry,
          attendanceLabel: attendanceCount[entry.employee.full_name] > 1 ? `attendance: ${attendanceCount[entry.employee.full_name]}` : null,
        }));

        setAttendanceData(attendanceWithCount);
      } catch (error) {
        console.error("Error fetching attendance data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userData]);

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
      <LinearGradient colors={['#F8BBD0', '#F5C8D1']} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.text}>Welcome to the Dashboard!</Text>
          <View style={styles.infoContainer}>
            {attendanceData?.map((entry, index) => (
              <View key={index} style={styles.timeContainer}>
                <Text style={styles.infoText}>Employee: {entry.employee.full_name || "N/A"}</Text>
                {entry.attendanceLabel && <Text style={styles.infoText}>{entry.attendanceLabel}</Text>}
                <Text style={styles.infoText}>Date: {entry.date || "N/A"}</Text>
                <Text style={styles.infoText}>Time In: <Text style={styles.timeIn}>{entry.time_in || "N/A"}</Text></Text>
                <Text style={styles.infoText}>Time Out: <Text style={styles.timeOut}>{entry.time_out || "N/A"}</Text></Text>
                <Text style={styles.infoText}>Is Present: {entry.is_present ? 'Yes' : 'No'}</Text>
              </View>
            ))}
            {!attendanceData?.length && <Text style={styles.emptyText}>No attendance records available</Text>}
          </View>
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { padding: 20, backgroundColor: '#FF80AB', justifyContent: 'center', alignItems: 'center', borderRadius: 20 },
  headerText: { fontSize: 26, fontWeight: 'bold', color: '#fff',  letterSpacing: 2 },
  contentContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  text: { fontSize: 18, color: '#333', marginBottom: 20,  fontWeight: '500' },
  infoContainer: { width: '100%' },
  timeContainer: { 
    backgroundColor: '#FFEBEE', 
    borderRadius: 20, 
    padding: 15, 
    margin: 12, 
    borderWidth: 1, 
    borderColor: '#FF80AB', 
    shadowColor: '#FF80AB',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },  
});

export default Dashboard;
