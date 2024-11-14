import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from 'styled-components/native';
import { Provider } from 'react-redux';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { store } from './src/store';
import { theme } from './src/theme';

import Home from './src/screens/Home';
import UserProfile from './src/screens/UserProfile';
import CreatePost from './src/screens/CreatePost';
import Favorites from './src/screens/Favorites';
import Login from './src/screens/Login';
import CreateUser from './src/screens/CreateUser';
import ViewPost from './src/screens/ViewPost';

export type RootStackParamList = {
  Home: undefined;
  UserProfile: { userId: number };
  CreatePost: undefined;
  Favorites: undefined;
  Login: {
    setIsAuthenticated: (value: boolean) => void;
  };
  CreateUser: undefined;
  ViewPost: { postId: number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await AsyncStorage.removeItem('currentUser');
        await checkAuthStatus();
      } catch (error) {
        console.error('Erro na inicialização:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    init();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      setIsAuthenticated(currentUser ? true : false);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      setIsAuthenticated(false);
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
              animation: 'fade'
            }}
          >
            {!isAuthenticated && (
              <>
                <Stack.Screen 
                  name="Login" 
                  component={Login}
                  initialParams={{
                    setIsAuthenticated
                  }}
                />
                <Stack.Screen 
                  name="CreateUser" 
                  component={CreateUser}
                />
              </>
            )}
            {isAuthenticated && (
              <>
                <Stack.Screen name="Home" component={Home} />
                <Stack.Screen name="UserProfile" component={UserProfile} />
                <Stack.Screen name="CreatePost" component={CreatePost} />
                <Stack.Screen name="Favorites" component={Favorites} />
                <Stack.Screen name="ViewPost" component={ViewPost} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
}
