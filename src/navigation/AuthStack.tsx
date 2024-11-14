import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Login';
import CreateUser from '../screens/CreateUser';

// Defina o tipo dos parâmetros da navegação
type AuthStackParamList = {
  Login: {
    setIsAuthenticated: (value: boolean) => void;
  };
  CreateUser: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator 
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen 
        name="Login" 
        component={Login}
        initialParams={{ setIsAuthenticated: (value: boolean) => {
          // Implemente aqui a lógica para atualizar o estado de autenticação
        }}}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="CreateUser" 
        component={CreateUser} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
} 