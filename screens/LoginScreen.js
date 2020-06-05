import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';


import colors from "../constants/colors";
import Card from "../components/Card";
import Input from "../components/Input";
const axios = require('axios');

function LoginScreen({ route, navigation }) {
  const [enteredValue, setEnteredValue] = useState("");
  const [enteredPassword, setPassword] = useState("");
  const [spinner,setSpinner] = useState(false)

  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  const passwordInputHandler = (inputText) => {
    setPassword(inputText);
  };

  const resetInputHandler = () => {
      setEnteredValue("")
      setPassword("")
  }

  const handlespinner = (bo) => {
    setSpinner(bo)
  }

  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>

      <View style={styles.screen}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
        <Text style={styles.title}>Log in</Text>
        <Card style={styles.inputContainer}>
          <Text>Identification number</Text>
          <Input
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="number-pad"
            onChangeText={numberInputHandler}
            value={enteredValue}
          />
          <Text>Password</Text>
          <Input
            style={styles.input}
            secureTextEntry={true}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={passwordInputHandler}
            value={enteredPassword}
          />
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button title="Register" onPress={() => { navigation.navigate('Register') }} color={colors.accent} />
            </View>
            <View style={styles.button}>
              <Button
                title="Log in"
                onPress={() => {
                  handlespinner(true)
                  axios.post('https://coronamaptrackerbackend.herokuapp.com/api/login', {
                    id_user: enteredValue,
                    password: enteredPassword
                  }).then(async function (response) {
                    token = response.request._lowerCaseResponseHeaders["auth-token"]
                    try {
                     await AsyncStorage.setItem(
                        'Token',
                        token
                      );
                      await AsyncStorage.setItem(
                        'id_user',
                        enteredValue
                      );
                      navigation.navigate('Menu')
                      //const value = await AsyncStorage.getItem('Token');
                      //console.log(value)
                    } catch (error) {
                      console.log("Error in the storage for the token")
                    }
                    resetInputHandler()
                    alert("Login successful!!")
                    handlespinner(false)
                  })
                  .catch(function (error) {
                    if(error.response.data){
                      alert("An error have been ocurred: " +error.response.data)
                    }
                    handlespinner(false)
                  });
                }}
                color={colors.primary}
              />
            </View>
          </View>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
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
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  button: {
    width: "45%",
  },
  input: {
    width: "50%",
    textAlign: "center",
  },
});

export default LoginScreen;
