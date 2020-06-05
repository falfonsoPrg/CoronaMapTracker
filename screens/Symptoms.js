import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage
  } from "react-native";
import { Button, Icon } from 'native-base';
import axios from 'axios';
import Spinner from 'react-native-loading-spinner-overlay';
import colors from "../constants/colors";
import Card from "../components/Card";



export default function Symptoms({ route, navigation }) {
    const [userSymptoms,setUserSymptoms] = useState([]);
    const [allSymptoms,setAllSymptoms] = useState([]);

    const [spinner,setSpinner] = useState(false)

    const handlespinner = (bo) => {
        setSpinner(bo)
      }

    const refreshUserSymptoms = (id_user,token) => {
        axios({
            url: 'https://coronamaptrackerbackend.herokuapp.com/user/allSymptomsOfUser/'+id_user,
            method: 'get',
            headers: {
              "auth-token": token,
              'Content-Type': 'application/json',
            }
          })
          .then(function (response) {
            setUserSymptoms(response.data)
          })
          .catch(function (error) {
            alert("An error ocurred, try again")
          });
    }
    useEffect(() => {
        
        async function fetchSymptoms(){
            try {
              handlespinner(true)

              var token = await AsyncStorage.getItem('Token');
              var id_user = await AsyncStorage.getItem('id_user');

              refreshUserSymptoms(id_user,token)

              axios({
                url: 'https://coronamaptrackerbackend.herokuapp.com/user/allSymptoms/',
                method: 'get',
                headers: {
                  "auth-token": token,
                  'Content-Type': 'application/json',
                }
              })
              .then(function (response) {
                setAllSymptoms(response.data)
                handlespinner(false)
              })
              .catch(function (error) {
                alert("An error ocurred, try again")
              });
            }
                catch(exception) {
                alert("An error ocurred, try again")
            }
        }
        fetchSymptoms();
    }, []);//End of use state

    const list = () => {
        return allSymptoms.map(element => {
            return (
                <View styles={styles.buttonContainer} key={element.cod_symptom}>
                    
                    <Button light success onPress={async () => {
                        handlespinner(true)
                        const id_user = await AsyncStorage.getItem('id_user');
                        const token = await AsyncStorage.getItem("Token");
                        axios({
                            url: 'https://coronamaptrackerbackend.herokuapp.com/user/addSymptomToUser',
                            method: 'post',
                            data: {
                              id_user: id_user,
                              cod_symptom: element.cod_symptom,
                            },
                            headers: {
                              "auth-token": token,
                              'Content-Type': 'application/json',
                            }
                          })
                          .then(function (response) {
                            handlespinner(false)
                            refreshUserSymptoms(id_user,token)
                          })
                          .catch(function (error) {
                            handlespinner(false)
                            if(error.response.data){
                                alert("You already have that symptom")
                              }
                          });
                    }}>
                        <View styles={styles.symptom}><Text>{element.nom_symptom}</Text></View>
                        <Icon name='md-add-circle' />
                    </Button>
                </View>
            );
        });
    };

    const listU = () => {
        return userSymptoms.map(element => {
            return (
                <View styles={styles.buttonContainer} key={element.cod_symptom}>
                    
                    <Button light danger onPress={async () => {
                        handlespinner(true)
                        const id_user = await AsyncStorage.getItem('id_user');
                        const token = await AsyncStorage.getItem("Token");
                        axios({
                            url: 'https://coronamaptrackerbackend.herokuapp.com/user/deleteSymtomFromUser/'+id_user+"/"+element.cod_symptom,
                            method: 'delete',
                            data: {
                              id_user: id_user,
                              cod_symptom: element.cod_symptom,
                            },
                            headers: {
                              "auth-token": token,
                              'Content-Type': 'application/json',
                            }
                          })
                          .then(function (response) {
                            handlespinner(false)
                            refreshUserSymptoms(id_user,token)
                          })
                          .catch(function (error) {
                            handlespinner(false)
                            if(error.response.data){
                                alert("You already have that symptom")
                              }
                          });
                    }}>
                        <View styles={styles.symptom}><Text>{element.nom_symptom}</Text></View>
                        <Icon name='md-add-circle' />
                    </Button>
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
            <Text style={styles.title}>Your symptoms</Text>
            <Card>
                {listU()}
            </Card>
            <Text style={styles.title}>Add symptoms</Text>
            <Card>
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
      flexDirection: "column",
      alignItems: "center",
      marginBottom:50
    },
    symptom: {
      paddingLeft: 35,
    },
    input: {
      width: "50%",
      textAlign: "center",
    },
  });
  