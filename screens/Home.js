import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View,Vibration,AsyncStorage} from 'react-native';
import { Container, Header, Icon, Fab } from 'native-base';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

export default function Home() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [active, setActive] = useState(false);
  
    useEffect(() => {
      (async () => {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }, []);
  
    const changeButtom = () => {

    }

    const sendData = async (code, date) => {
      const value = await AsyncStorage.getItem('id_user');
      const token = await AsyncStorage.getItem('Token');
      axios({
        url: 'https://coronamaptrackerbackend.herokuapp.com/user/addDestinationToUser',
        method: 'post',
        data: {
          id_user: value,
          cod_place: code,
          time_destination: date
        },
        headers: {
          "auth-token": token,
          'Content-Type': 'application/json',
        }
      })
      .then(function (response) {
        alert("You have been registered succeed")
        Vibration.vibrate()
      })
      .catch(function (error) {
        if(error.response.data){
          console.log(error.response)
          alert("An error ocurred, try again" + error.response.data)
        }
        
      });
    }
  
    const handleBarCodeScanned = ({ type, data }) => {
      setScanned(true)
      var date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' + 
            ('00' + date.getUTCHours()).slice(-2) + ':' + 
            ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
            ('00' + date.getUTCSeconds()).slice(-2);

      sendData(data, date)
    };
  
    if (hasPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    }
    if (hasPermission === false) {
      return <Text>No access to camera</Text>;
    }
  
    return (
        <View style={styles.container}>
          <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFill}
        />
          <Fab
            active={active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={() => setActive(!active)}>
            <Icon name="share" />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
          </Fab>
        {scanned && <Button title={'Press for scan'} color="#8a2be2" onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });