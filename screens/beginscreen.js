import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function BeginScreen({ navigation }) {
  const handlePress = () => {
    navigation.navigate('Login');
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <LinearGradient colors={['#FFA500', '#FF4500']} style={styles.gradient}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./logo/qpl.png')}
            style={styles.image}
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Payroll Management System</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,  // Adds some padding to the top for the image
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,  // Adds space between the image and the title
  },
  image: {
    width: 150,   // Adjust the size of the image
    height: 150,  // Adjust the size of the image
    resizeMode: 'contain',  // Makes sure the image scales without distortion
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

export default BeginScreen;
