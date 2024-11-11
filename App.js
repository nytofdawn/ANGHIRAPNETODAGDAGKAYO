import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Easing } from 'react-native';
import LoginScreen from './screens/login';
import Dashboard from './screens/dashboard';
import profilescreen from './screens/profile';
import NotificationScreen from './screens/notification';
import ForgotPasswordScreen from './screens/forgotpassword';
import BeginScreen from './screens/beginscreen';


const Stack = createStackNavigator();

const customTransition = {
  gestureEnabled: true,
  cardStyleInterpolator: ({ current, next, layouts }) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [layouts.screen.width, 0],
      easing: Easing.out(Easing.cubic),  
    });

    return {
      cardStyle: {
        transform: [
          {
            translateX,
          },
        ],
      },
    };
  },
};

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Begin"
          screenOptions={{
            headerShown: false,
            customTransition,
          }}
        >
          <Stack.Screen name="Begin" component={BeginScreen} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="Profile" component={profilescreen} />
        </Stack.Navigator>
      </NavigationContainer>
  );
};

export default App;
