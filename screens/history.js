import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Layout from "../Navigation/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HistoryScreen = ({ navigation }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [payHistoryData, setPayHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

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
        const response = await fetch("http://192.168.100.154:8000/api/attendance/", {
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

  // Fetch PayHistory from AsyncStorage
  useEffect(() => {
    const fetchPayHistory = async () => {
      try {
        const storedPayHistory = await AsyncStorage.getItem("PayHistory");
        if (storedPayHistory) {
          setPayHistoryData(JSON.parse(storedPayHistory));
        }
      } catch (error) {
        console.error("Error retrieving PayHistory from AsyncStorage:", error);
      }
    };

    fetchPayHistory();
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

  const renderAttendanceItem = ({ item }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.attendanceText}>Date: {item.date}</Text>
      <Text style={styles.attendanceText}>Time In: {item.time_in || "N/A"}</Text>
      <Text style={styles.attendanceText}>Time Out: {item.time_out || "N/A"}</Text>
    </View>
  );

  const renderPayHistoryItem = ({ item }) => (
    <View style={styles.payHistoryItem}>
      <Text style={styles.payHistoryText}>Payment Date: {item.end_date}</Text>
      <Text style={styles.payHistoryText}>Amount: {item.amount}</Text>
    </View>
  );

  return (
    <Layout navigation={navigation} activeTab="History">
      <LinearGradient colors={["white", "white"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Attendance History</Text>
        </View>
        <View style={styles.totalAttendanceContainer}>
          <Text style={styles.totalAttendanceText}>Total Attendance: {getTotalAttendance()} this Month</Text>
        </View>

        <View style={styles.payHistoryContainer}>
          <Text style={styles.payHistoryHeaderText}>Pay History</Text>
          <FlatList
            data={payHistoryData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderPayHistoryItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </LinearGradient>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
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
    elevation: 5,
  },
  headerText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  totalAttendanceContainer: {
    marginTop: 20,
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  totalAttendanceText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
  },
  payHistoryContainer: {
    marginTop: 20,
    backgroundColor: "#FFEBEE",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payHistoryHeaderText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
  },
  payHistoryItem: {
    backgroundColor: "#FFEBEE",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    marginBottom: 10,
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  payHistoryText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 5,
  },
  listContainer: {
    paddingBottom: 10,
  },
  attendanceItem: {
    marginRight: 80,
    backgroundColor: "#FFEBEE",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#FF80AB",
    shadowColor: "#FF80AB",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  attendanceText: {
    fontSize: 10,
    color: "#333",
    marginBottom: 8,
  },
});

export default HistoryScreen;
