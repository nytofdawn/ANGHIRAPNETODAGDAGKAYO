import React from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Image } from "react-native";

const Layout = ({ children, navigation, activeTab }) => {
  const handleFooterPress = (destination) => {
    if (navigation) {
      navigation.navigate(destination);
    } else {
      console.error("Navigation prop is not available");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {children}
      </View>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'Home' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('Dashboard')}
        >
          <Image 
            source={require('./icons/home.png')} // Path to your PNG image
            style={[styles.icon, activeTab === 'Home' && styles.activeIcon]} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'Notifications' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('Notifications')}
        >
          <Image 
            source={require('./icons/notif.png')} // Path to your PNG image
            style={[styles.icon, activeTab === 'Notifications' && styles.activeIcon]} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'History' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('History')}
        >
          <Image 
            source={require('./icons/history.png')} // Path to your PNG image
            style={[styles.icon, activeTab === 'History' && styles.activeIcon]} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'Profile' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('Profile')}
        >
          <Image 
            source={require('./icons/profile.png')} // Path to your PNG image
            style={[styles.icon, activeTab === 'Profile' && styles.activeIcon]} 
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'red',
    paddingVertical: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  icon: {
    width: 30, // Set a fixed width for the icon
    height: 30, // Set a fixed height for the icon
  },
  activeFooterButton: {
    borderBottomWidth: 3,
    borderBottomColor: '#fff',
  },
  activeIcon: {
    opacity: 1, // You can also add some effects like opacity to highlight active icon
  },
});

export default Layout;
