import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, BackHandler, Alert, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Layout from "../Navigation/layout";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Dashboard = ({ navigation }) => {
  const [attendanceData, setAttendanceData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [totalAttendance, setTotalAttendance] = useState(0); 
  const [error, setError] = useState(null);

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

        const attendanceCount = userAttendance.length;
        setTotalAttendance(attendanceCount);

        await AsyncStorage.setItem(
          "totalAttendance",
          JSON.stringify({ total: attendanceCount })
        );
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        setError("Unable to load attendance data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [userData]);

  const getCurrentDate = () => {
    const date = new Date();
    return date.toISOString().split("T")[0];
  };

  const currentDate = getCurrentDate();
  const currentAttendance = attendanceData.filter((entry) => entry.date === currentDate);


  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        "Are you sure?",
        "Do you want to log out and exit the app?",
        [
          {
            text: "Cancel",
            onPress: () => null,
            style: "cancel"
          },
          {
            text: "LOG OUT",
            onPress: async () => {
              await AsyncStorage.clear();
  
              navigation.navigate('Login');
            }
          },
          {
            text: "EXIT",
            onPress: () => {
              BackHandler.exitApp(); // Exit the app
            }
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
  }, [navigation]);
  
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

  if (error) {
    return (
      <Layout navigation={navigation} activeTab="Home">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout navigation={navigation} activeTab="Home">
      <LinearGradient colors={["#FFFFFF", "#FFFFFF"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Dashboard</Text>
        </View>
        {/* Add the Logo here */}
        <View style={styles.logoContainer}>
          <Image source={require('./logo/qpl.png')} style={styles.logo} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.attendanceContainer}>
            <Text style={styles.infoText}>Current Date: {currentDate}</Text>
            <Text style={styles.infoText}>Work Attendance: {totalAttendance || "N/A"}</Text>
            <Text style={styles.infoText}>
              TIME IN:{" "}
              <Text style={styles.timeIn}>
                {currentAttendance[0]?.time_in || "N/A"}
              </Text>
            </Text>
            <Text style={styles.infoText}>
              TIME OUT:{" "}
              <Text style={styles.timeOut}>
                {currentAttendance[0]?.time_out || "N/A"}
              </Text>
            </Text>
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
  logoContainer: {
    alignItems: 'center', 
    marginVertical: 20, 
  },
  logo: {
    width: 100, 
    height: 100, 
    resizeMode: 'contain',
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  attendanceContainer: {
    backgroundColor: "#FFFFFF", 
    borderRadius: 20,
    padding: 20,
    width: "100%",
    borderWidth: 1,
    borderColor: "#FF7F00", 
    shadowColor: "#FF7F00",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6, 
  },
  infoText: { fontSize: 18, color: "#333", marginBottom: 10 },
  timeIn: { color: "#4CAF50", fontWeight: "bold" },
  timeOut: { color: "#F44336", fontWeight: "bold" },
});

export default Dashboard;
