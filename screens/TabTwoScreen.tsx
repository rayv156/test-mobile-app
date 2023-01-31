import { StyleSheet, Image, TouchableOpacity, TextInput } from 'react-native';
import React from 'react';
import { GlobalCtx } from '../App';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { FontAwesome } from '@expo/vector-icons';
import CarrierShow from '../components/CarrierShow';
import { Button } from '@rneui/themed';
import { RootTabScreenProps } from '../types';
import * as SecureStore from 'expo-secure-store';

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  const { gState } = React.useContext(GlobalCtx)
  const { url, user } = gState
  const [formData, setFormData] = React.useState({
    mcNumber: "",
  })

  const [carriers, setCarriers]= React.useState([])
  const [selectedCarrier, setSelectedCarrier]= React.useState(null)

  const getCarriers = async () => {
    const token = await SecureStore.getItemAsync("secure_token")
      const response = await fetch(url + `/carrier/search/${formData.mcNumber}`,  {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        }
    })
      const data = await response.json()
      setCarriers(data.content)
      setSelectedCarrier(formData.mcNumber);
    }

  const createChange = ({ type, text }) => {
    setFormData({...formData, [type]: text});
    }
  
    //our handle create function, for when the form is submitted
    const handleSubmit = async () => {
    getCarriers()

  }

  const handleSave = async (event, index) => {
    event.preventDefault() //prevent page refresh
    const token = await SecureStore.getItemAsync("secure_token")
    await fetch(url + "/carrier", {
      method: "post",
      headers: {
        "Content-Type":"application/json",
        "Authorization": `bearer ${token}`
      },
      body: JSON.stringify({
          carrier: carriers[index].carrier.legalName,
          dotNumber: carriers[index].carrier.dotNumber,
          mcNumber: selectedCarrier,
          allowedToOperate: carriers[index].carrier.allowedToOperate,
          phyStreet: carriers[index].carrier.phyStreet,
          phyCity: carriers[index].carrier.phyCity,
          phyState: carriers[index].carrier.phyState,
          phyZip: carriers[index].carrier.phyZipcode,
          phyCountry: carriers[index].carrier.phyCountry,
          telephone: carriers[index].carrier.telephone,
          user: user
      })
    })
    navigation.goBack();
}

  const displaySearch = () => {
    return (
         carriers.map((carrier, index)=> (
         <View style={{marginTop: 12, padding: 12}}>
           <CarrierShow carrier={carrier.carrier} mcNumber={selectedCarrier} />
           <Button onPress={(e)=> handleSave(e, index)} style={{alignSelf: 'center'}}>Save Carrier</Button>
       </View>))
    )
   }

  return (<>
  
    <View style={styles.header}>
    <Image style={{width: 50, height: 50, margin: 5}} source={{uri: 'https://logodix.com/logo/1733700.png'}}/>
    <View style={styles.input}>
    <TextInput autoCapitalize="none" placeholder="Search" value={formData.mcNumber} onChangeText={(text) => createChange({ type: 'mcNumber', text })} onSubmitEditing={()=> handleSubmit()} />
    
    <TouchableOpacity onPress={()=> handleSubmit()}>
    <FontAwesome name="search" style={{fontSize: 30}}></FontAwesome>
    </TouchableOpacity>
    </View>
    
  </View>
   {carriers[0]?.carrier ? displaySearch() : <View style={{alignSelf: 'center'}}><Text>Search for Carrier</Text></View>}
   </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    borderRadius: 15,
    borderColor: 'black',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    width: "45%",
    height: 45,
    margin: 'auto',
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: "center",
    backgroundColor: '#fffbf3',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  header: {
    display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', margin: 'auto', width: '100%', backgroundColor: 'rgb(169,172,188)', alignItems: 'center', padding: 15, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
  }
});
