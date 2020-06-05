import React, {useState,useEffect} from 'react'
import {
    View,
    Text,
    StyleSheet,
    Button,
    AsyncStorage
  } from "react-native";
import colors from "../constants/colors";
import Card from "../components/Card";
import Input from "../components/Input";
import Spinner from 'react-native-loading-spinner-overlay';
import * as Location from 'expo-location';

const axios = require('axios');

export default function Place({ route, navigation }) {
    const [namePlace,setNamePlace] = useState("")
    const [allPlaces,setAllPlaces] = useState([])
    const [spinner,setSpinner] = useState(false)

    const handleNamePlace = (place) => {
        setNamePlace(place)
    }

    const resetInputHandler = () => {
        setNamePlace("")
    }

    const handlespinner = (bo) => {
        setSpinner(bo)
    }

    const refreshPlaces = (token) =>{
        axios({
            url: 'https://coronamaptrackerbackend.herokuapp.com/user/findAllPlaces/',
            method: 'get',
            headers: {
              "auth-token": token,
              'Content-Type': 'application/json',
            }
          })
          .then(function (response) {
            setAllPlaces(response.data)
          })
          .catch(function (error) {
            alert("An error ocurred, try again")
          });
    }

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
        }
      })();

        async function fetchPlace(){

            handlespinner(true)
            var token = await AsyncStorage.getItem('Token');
            refreshPlaces(token)
            handlespinner(false)

        }
        fetchPlace();
    }, []);//End of use state


    const list = () => {
        return allPlaces.map(element => {
            return (
                <View styles={styles.buttonContainer} key={element.cod_place}>
                    <Text>{element.cod_place}. {element.place_name}</Text>
                </View>
            );
        });
    };


    return (
        <View style={styles.screen}>
                <Spinner
                    visible={spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                />
            <Text style={styles.title}>Add new place</Text>
            <Card style={styles.inputContainer}>
                <Text>Name place</Text>
                <Input
                    style={styles.input}
                    blurOnSubmit
                    autoCapitalize="none"
                    autoCorrect={false}
                    onChangeText={handleNamePlace}
                    value={namePlace}
                />
                <View style={styles.buttonContainer}>
                    <View style={styles.button}>
                    <Button title="Cancel" onPress={() => {
                        navigation.goBack()
                        resetInputHandler()
                        }} color={colors.accent} />
                    </View>
                    <View style={styles.button}>
                    <Button title="Add" onPress={ async () => {
                        try {
                        handlespinner(true)
                        var token = await AsyncStorage.getItem('Token');
                        let location = await Location.getCurrentPositionAsync({});
                        console.log(location.coords.altitude)
                        axios({
                          url: 'https://coronamaptrackerbackend.herokuapp.com/user/registerPlace',
                          method: 'post',
                          data: {
                              cod_place: 0,
                              place_name: namePlace,
                              latitude_place: location.coords.latitude,
                              longitude_place: location.coords.longitude
                          },
                          headers: {
                            "auth-token": token,
                            'Content-Type': 'application/json',
                          }
                        }).then(function (response) {
                          handlespinner(false)
                          refreshPlaces(token)
                        }).catch(function (error) {
                          handlespinner(false)
                          if(error.response){
                              alert("An error occurred: " + error.response.data)
                            }
                        });
                          } catch (error) {
                              console.log(error)
                          }
                        }} color={colors.accent} />
                    </View>
                </View>
            </Card>

            <Text style={styles.title}>All places</Text>
            <Card style={styles.inputContainer}>
                {list()}
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