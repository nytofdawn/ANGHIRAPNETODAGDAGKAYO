import React from "react";
import { View, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome'; // Import vector icon library

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
          <Icon name="home" size={40} color={activeTab === 'Home' ? '#fff' : '#000'} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'Notifications' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('Notifications')}
        >
          <Icon name="bell" size={40} color={activeTab === 'Notifications' ? '#fff' : '#000'} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'History' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('History')}
        >
          <Icon name="history" size={40} color={activeTab === 'History' ? '#fff' : '#000'} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.footerButton, activeTab === 'Profile' && styles.activeFooterButton]}
          onPress={() => handleFooterPress('Profile')}
        >
          <Icon name="user" size={40} color={activeTab === 'Profile' ? '#fff' : '#000'} style={styles.icon} />
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
    width: 40, // Increased size for vector icon
    height: 40, // Increased size for vector icon
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
