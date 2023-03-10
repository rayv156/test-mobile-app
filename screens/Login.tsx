import * as React from 'react';
import { 
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Keyboard,
  KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback 
        } from 'react-native';
import * as SecureStore from 'expo-secure-store'
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Ionicons } from '@expo/vector-icons';
import { GlobalCtx } from '../App';
import { RootStackScreenProps } from '../types';
import { RootStackParamList } from '../types';

const bckColor = '#fffbf3'

const Login = ({navigation}: RootStackScreenProps<'Login'>) => {
  const {gState, setgState} = React.useContext(GlobalCtx)

  const {url} = gState
    const [formData, setFormData] = React.useState({
        username: "",
        password: ""
      })

    const createChange = ({ type, text }) => 
    setFormData({...formData, [type]: text});


  //our handle create function, for when the form is submitted
  const handleCreate = async () => {
    
    await fetch(`${url}/auth/login`, {
      method: "post",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(async (data) => {
      try {
        if (data.token) {
        await SecureStore.setItemAsync('secure_token', `${data.token}`);
        await SecureStore.setItemAsync('userid', `${data.username}`);
        setgState({...gState, token: true, user: data.username, error: null})
        } else {
          setgState({...gState, token: false, user_id: null, error: data.error})
        }

      } catch (err) {
        alert(err);
      }
    })
  }
    return (
      <View style={styles.container} >
         <KeyboardAvoidingView
            behavior="padding" style={styles.container}>
        <ScrollView>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} style={{margin: 'auto', backgroundColor: bckColor}}>
          <>
          <Image style={{width: 200, height: 200, alignSelf: 'center'}} source={{uri: 'https://i.imgur.com/7cwNdmk.png'}}/>
          <View style={{width: '100%', backgroundColor: '#fffbf3'}}>
          <View style={{flexDirection: 'row', width: '100%', backgroundColor: bckColor}}>
            <Text style={styles.icons}><Ionicons name="person-outline" style={{fontSize: 30}}/></Text>
        <TextInput autoCapitalize="none" placeholder="username" value={formData.username} onChangeText={(text) => createChange({ type: 'username', text })} style={styles.input}/>
        </View>
        <Text></Text>
            <Text></Text>
            <Text></Text>
        <View style={{flexDirection: 'row', backgroundColor: bckColor}}>
        <Text style={styles.icons}><Ionicons name="lock-closed-outline" style={{fontSize: 30, marginBottom: -10}}/></Text>
        <TextInput autoCapitalize="none" textContentType={'oneTimeCode'} secureTextEntry={true} placeholder="password" value={formData.password} onChangeText={(text) => createChange({ type: 'password', text })} style={styles.input}/>
        </View>
        </View>
        <Text style={{color: 'red', textAlign: 'center', marginTop: 10}}>{gState.error}</Text>
        </>
        </TouchableWithoutFeedback>
        <TouchableOpacity style={styles.btn} onPress={()=> handleCreate()}>
            <Text style={{color: 'white'}}>
                Login
            </Text>
        </TouchableOpacity>
            <Text></Text>
            <Text></Text>
            <Text></Text>
        <Text style={{textAlign: 'center', color: 'black'}}>If you don't have an account, sign up here </Text>
        <TouchableOpacity style={styles.btnSignup} onPress={() => navigation.navigate('Signup')}><Text style={{color: 'white'}}>Signup</Text></TouchableOpacity>
        </ScrollView>
        </KeyboardAvoidingView>
        </View>
    
    )
  }

  const styles = StyleSheet.create({
    input: {
      borderBottomWidth: 3,
      width: "80%",
      height: 45,
      alignItems: 'center',
      paddingLeft: 15,
      justifyContent: 'space-between',
      alignSelf: "center",
      backgroundColor: bckColor,
    },
    icons: {
      borderBottomWidth: 3,
      height: 45,
      fontSize: 30, 
      paddingLeft: 10,
      alignItems: 'center',
      backgroundColor: bckColor,
      color: 'black'
    },
    btn: {
      width: "80%",
      borderRadius: 25,
      height: 50,
      alignSelf: "center",
      alignItems: 'center',
      justifyContent: "center",
      marginTop: 20,
      backgroundColor: "rgb(37,74,80)",
      color: 'white',
      textAlign: 'center'
    },
    btnSignup: {
      width: "30%",
      borderRadius: 25,
      height: 50,
      alignItems: "center",
      alignSelf: 'center',
      justifyContent: "center",
      marginTop: 40,
      backgroundColor: "rgb(55,97,130)",
      color: 'white'
    },
    body: {
      backgroundColor: 'white',
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
      borderStyle: 'solid',
      borderColor: 'black'
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: 'black',
    },
    sectionDescription: {
      textAlign: 'center',
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
      color: 'black',
    },
    container: {
      flex: 1,
      backgroundColor: bckColor,
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      paddingTop: 32
    }
  });

export default Login