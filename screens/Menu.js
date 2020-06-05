import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    AsyncStorage
  } from "react-native";
import colors from "../constants/colors";
import Card from "../components/Card";

export default function Menu({ route, navigation }) {
  //<View style={styles.button}><Button title="View Profile" onPress={() => { navigation.navigate("Profile") }} color={colors.accent} /></View>
    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Corona Map Tracker</Text>
            <Card style={styles.inputContainer}>
              <View style={styles.buttonContainer}>
                <View style={styles.button}><Button title="Register QR" onPress={() => {navigation.navigate("Scan QR")}} color={colors.accent} /></View>
                <View style={styles.button}><Button title="Register Symptoms" onPress={() => { navigation.navigate("Symptoms") }} color={colors.accent} /></View>
                <View style={styles.button}><Button title="Register Place" onPress={() => { navigation.navigate("Place") }} color={colors.accent} /></View>
                <View ><Button title="Log out" onPress={ async () => {
                      try {
                        await AsyncStorage.removeItem("Token");
                        await AsyncStorage.removeItem("id_user");
                        navigation.goBack()
                      }
                      catch(exception) {
                        console.log(exception)
                        alert("An error ocurred when loggin out")
                      }
                }} color={colors.accent} /></View>
              </View>
            </Card>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
      padding: 10,
      alignItems: "center",
    },
    title: {
      fontSize: 20,
      marginVertical: 10,
    },
    inputContainer: {
      width: 300,
      maxWidth: "80%",
      alignItems: "center",
    },
    buttonContainer: {
      flexDirection: "column",
      width: "100%",
      justifyContent: "space-between",
      paddingHorizontal: 15,
    },
    button: {
      paddingBottom: 35,
    },
    input: {
      width: "50%",
      textAlign: "center",
    },
  });
  