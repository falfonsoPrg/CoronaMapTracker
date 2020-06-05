import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';


import colors from "../constants/colors";
import Card from "../components/Card";
import Input from "../components/Input";
const axios = require('axios');

function RegisterScreen({ route, navigation }) {
  const [enteredValue, setEnteredValue] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [enteredPassword, setPassword] = useState("");

  const [spinner,setSpinner] = useState(false)
  const handlespinner = (bo) => {
    setSpinner(bo)
  }

  const numberInputHandler = (inputText) => {
    setEnteredValue(inputText.replace(/[^0-9]/g, ""));
  };

  const firstNameInputHandler = (inputText) => {
    setFirstName(inputText);
  };
  const lastNameInputHandler = (inputText) => {
    setLastName(inputText);
  };
  const passwordInputHandler = (inputText) => {
    setPassword(inputText);
  };


  const resetInputHandler = () => {
      setEnteredValue("")
      setPassword("")
  }
  return (
    <TouchableWithoutFeedback onPress={()=>{Keyboard.dismiss()}}>
      <View style={styles.screen}>
      <Spinner
        visible={spinner}
        textContent={'Loading...'}
        textStyle={styles.spinnerTextStyle}
      />
        <Text style={styles.title}>Register</Text>
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
          <Text>First name</Text>
          <Input
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={firstNameInputHandler}
            value={firstName}
          />
          <Text>Last name</Text>
          <Input
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={lastNameInputHandler}
            value={lastName}
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
              <Button title="Cancel" onPress={() => {
                navigation.goBack()
                resetInputHandler()
                }} color={colors.accent} />
            </View>
            <View style={styles.button}>
              <Button
                title="Register"
                onPress={() => {
                  handlespinner(true)
                  axios.post('https://coronamaptrackerbackend.herokuapp.com/api/register', {
                    id_user: enteredValue,
                    first_name: firstName,
                    last_name: lastName,
                    password: enteredPassword
                  }).then(function (response) {
                    //console.log(response.request._response) Get The savedUser, result of the query
                    navigation.goBack()
                    alert("Successful register!!")
                    resetInputHandler()
                    handlespinner(false)
                  })
                  .catch(function (error) {
                    alert("An error have been ocurred: " +error.response.data)
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

export default RegisterScreen;
