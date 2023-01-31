import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store'

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

export const GlobalCtx = React.createContext(null)

export default function App() {
  const [gState, setgState]= React.useState({token: false, user: null, url: "https://carriers-backend.onrender.com", error: null})

  const getItems = async () => {
    const token = await SecureStore.getItemAsync('secure_token');
    const userInfo = await SecureStore.getItemAsync('userid') as string;
    const user = JSON.parse(userInfo);

    if (token) {
      return setgState({...gState, token: true, user: user })
    } else {
      return setgState({...gState, token: false, user: null})
    }
  }

  React.useEffect(() => {
    async () => {
      await getItems()
      console.log(gState)
    }
    }, [])
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <GlobalCtx.Provider value={{ gState, setgState }}>
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <StatusBar />
      </SafeAreaProvider>
      </GlobalCtx.Provider>
    );
  }
}
