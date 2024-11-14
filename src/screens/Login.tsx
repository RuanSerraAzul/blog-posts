import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  Container, 
  Input, 
  Label, 
  Button, 
  ButtonText, 
  LinkText, 
  Title 
} from '../components/AuthStyles';
import { store } from '../store';
import styled from 'styled-components/native';

type RootStackParamList = {
  Home: undefined;
  CreateUser: undefined;
  Login: undefined;
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type LoginScreenProps = {
  route: {
    params: {
      setIsAuthenticated: (value: boolean) => void;
    };
  };
};

export default function Login({ route }: LoginScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const { setIsAuthenticated } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      await Promise.all([
        AsyncStorage.removeItem('currentUser'),
        AsyncStorage.removeItem('localPosts'),
        AsyncStorage.removeItem('@favorites'),
        AsyncStorage.removeItem('@BlogPosts:postsCache'),
        store.dispatch({ type: 'posts/clearPosts' }),
        store.dispatch({ type: 'favorites/clearFavorites' })
      ]);

      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
      
      const user = parsedUsers.find(
        (u: any) => u.email === email && u.password === password
      );

      if (user) {
        await AsyncStorage.setItem('currentUser', JSON.stringify(user));
        setIsAuthenticated(true);
      } else {
        Alert.alert('Erro', 'Email ou senha incorretos');
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      Alert.alert('Erro', 'Não foi possível fazer login');
    }
  };

  return (
    <Container>
      <Title>LOGIN</Title>
      <Label>E-mail</Label>
      <Input
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholder="Digite seu email"
        placeholderTextColor="#A0A0A0"
      />
      
      <Label>Senha</Label>
      <Input
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholder="Digite sua senha"
        placeholderTextColor="#A0A0A0"
      />

      <Button onPress={handleLogin}>
        <ButtonText>Entrar</ButtonText>
      </Button>

      <LinkText onPress={() => navigation.navigate('CreateUser')}>
        Criar Nova Conta
      </LinkText>
    </Container>
  );
} 