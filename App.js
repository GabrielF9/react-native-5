import React from 'react';
import { createStackNavigator, createAppContainer } from "react-navigation";

import Acceleration from './src/screens/Acceleration';
import Profile from './src/screens/Profile';
import Login from './src/screens/Login';

const AppNavigator = createStackNavigator({
  Login: {
    screen: Login
  },
  Acceleration: {
    screen: Acceleration
  },
  Profile: {
    screen: Profile
  }
}, {
  headerMode: 'none',
  initialRouteName: 'Login'
});

export default createAppContainer(AppNavigator);
