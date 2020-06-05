import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Header from "./components/Header";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import Home from "./screens/Home";
import Menu from "./screens/Menu"
import Profile from "./screens/Profile"
import Symptoms from "./screens/Symptoms"
import Place from "./screens/Place"

const Stack = createStackNavigator();

export default function App() {
  return (

    <NavigationContainer>

      <Stack.Navigator>
        <Stack.Screen name="Log in" component={LoginScreen}/>
        <Stack.Screen name="Menu" component={Menu} options={{
          headerLeft: null
        }}/>
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Symptoms" component={Symptoms} />
        <Stack.Screen name="Place" component={Place} />
        <Stack.Screen name="Scan QR" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});
