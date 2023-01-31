import { ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import * as SecureStore from 'expo-secure-store';
import { GlobalCtx } from '../App';
import { Button, Skeleton, Card, Image } from '@rneui/themed';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { FontAwesome } from '@expo/vector-icons';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const { gState } = React.useContext(GlobalCtx)
  const { url } = gState
  const [agreements, setAgreements]= React.useState([])
  const [agreement, setAgreement] = React.useState([]);
  const [state, setState] = React.useState({
      search: "",
    });
  const [orderNumber, setOrderNumber] = React.useState([])

  const updateSearch = (event) => {
      setState({ ...state, search: event.target.value.substr(0, 20) });
  };

  const getAgreements = async () => {
    const token = await SecureStore.getItemAsync("secure_token")
      const response = await fetch(`${url}/agreement`,  {
        method: "get",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `bearer ${token}`
        }
    })
      const data = await response.json()
      setAgreements(data)
    }

    React.useEffect(() => {
      getAgreements()
    }, [])

    const spinner = () => {
      if (agreements.length === 0) {
          return (<Text>You currently do not have any saved agreements.  Click the create new agreement button above to get started.</Text>)
        } else {
          return (<>   
  <Skeleton animation="pulse" width={80} height={40} />
  <Skeleton
    animation="wave"
    width={80}
    height={40}
  />
  <Skeleton animation="none" width={80} height={40} />
          </>
        )
        }
  }

  const loaded = () => {
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});
           return (<>
           <ScrollView style={{width: '100%'}}>
          {agreements.map((agreement, i) => {
            return (
           <Card key={i} containerStyle={{borderRadius: 8}}>
          <Card.Title>#{agreement.orderNumber}</Card.Title>
          <Card.Divider />
                <Text style={styles.fonts}>From: {agreement.pickUpAddress}</Text>
                <FontAwesome
                name="exchange"
                size={25}
                color={'black'}
                style={{ margin: 15 }}
              />
                <Text style={styles.fonts}>To: {agreement.deliveryAddress}</Text>
                <Text style={styles.fonts}>{formatter.format(agreement.rate)}</Text>
                <Button
            buttonStyle={{
              borderRadius: 0,
              marginLeft: 0,
              marginRight: 0,
              marginBottom: 0,
              backgroundColor: 'rgb(55,119,95)'
            }}
            title="VIEW NOW"
            onPress={async ()=> await Linking.openURL(agreement.url)}
          />
        </Card>
            );
          })}
          </ScrollView>
         </>
         
       )
 
 }

  return (
    <View style={styles.container}>
      {agreements?.length > 0 ? loaded() : spinner()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  fonts: {
    marginBottom: 8,
    color: 'black'
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
