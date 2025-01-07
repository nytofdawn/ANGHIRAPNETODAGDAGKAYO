import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Layout from "../Navigation/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const HistoryScreen = ({ navigation }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const announcementAPI_URL = "http://3.27.173.131/api/announcements/";

  // Fetch user data from AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) setUserData(JSON.parse(storedUserData));
      } catch (error) {
        console.error("Error retrieving user data from AsyncStorage:", error);
      }
    };

    fetchUserData();
  }, []);

  // Fetch attendance data from API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      if (!userData?.token) {
        setError("User data is missing or token is invalid.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("http://3.27.173.131/api/attendance/", {
          method: "GET",
          headers: {
            Authorization: `Token ${userData.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch attendance data");
        }

        const data = await response.json();

        const userAttendance = data.filter(
          (entry) => String(entry.employee.id_number) === String(userData?.employee_number)
        );

        setAttendanceData(userAttendance);

        await AsyncStorage.setItem("attendance_history", JSON.stringify(userAttendance));
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Unable to load attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userData]);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          const token = parsedUserData.token;

          if (token) {
            const response = await axios.get(announcementAPI_URL, {
              headers: {
                Authorization: `Token ${token}`,
              },
            });

            setAnnouncements(response.data);
          } else {
            console.error("No token found in AsyncStorage");
          }
        }
      } catch (error) {
        console.error("Error retrieving announcements:", error);
        Alert.alert("Error", "Failed to load announcements.");
      }
    };

    fetchAnnouncements();
  }, []);

  // Calculate the total attendance for the current month
  const getTotalAttendance = () => {
    const currentMonth = new Date().getMonth();
    return attendanceData.filter(item => new Date(item.date).getMonth() === currentMonth).length;
  };

  // Loading state
  if (loading) {
    return (
      <Layout navigation={navigation} activeTab="History">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA500" />
          <Text>Loading...</Text>
        </View>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout navigation={navigation} activeTab="History">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="History">
      <LinearGradient colors={["white", "white"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Attendance History</Text>
        </View>

        <View style={styles.contentContainer}>
          {/* Total Attendance Section */}
          <View style={styles.totalAttendanceContainer}>
            <Text style={styles.totalAttendanceText}>Total Attendance: {getTotalAttendance()} this Month</Text>
          </View>

          {/* Announcement Section */}
          <View style={styles.announcementContainer}>
            <Text style={styles.text}>Announcement</Text>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.notificationCard}
                  onPress={() => Alert.alert("Announcement", announcement.description)}
                >
                  <Text style={styles.notificationText}>
                    {announcement.title || "No title"}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>No Announcement Available</Text>
            )}
          </View>
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 20,
    flex: 1,
  },
  totalAttendanceContainer: {
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 20,
    width: '90%',
  },
  totalAttendanceText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  announcementContainer: {
    marginTop: 20,
    width: '90%',
    padding: 15,
    backgroundColor: '#FFEBEE',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notificationCard: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FF80AB',
    borderRadius: 8,
    elevation: 4,
  },
  notificationText: {
    fontSize: 16,
    color: '#fff',
  },
  attendanceItem: {
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 10,
    width: '90%',
  },
  attendanceText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 10,
  },
});

export default HistoryScreen;
