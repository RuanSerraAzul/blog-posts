import React, { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { 
  Input, 
  Label, 
  ButtonText 
} from '../components/AuthStyles';
import styled from 'styled-components/native';

export const Button = styled.TouchableOpacity`
  background-color: #4A90E2;
  border-radius: 25px;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-horizontal: ${({ theme }) => theme.spacing.medium}px;
`;

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  justify-content: flex-start;
  padding-bottom: 40px;
`;

const BackButton = styled.TouchableOpacity`
  
  padding-top:20px;
  padding-left: 0;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  padding-top: 20px;
  background-color: white;
  margin-bottom: 30px;
`;

const ContentContainer = styled.View`
  padding-horizontal: ${({ theme }) => theme.spacing.medium}px;
`;

const Title = styled.Text`
  font-size: ${({ theme }) => theme.typography.fontSize.large}px;
  font-weight: 400;
  padding-top:20px;
  color: #424242;
  margin-left: 8px;
`;

export default function CreateUser() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  const handleCreateUser = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
      
      const username = email.split('@')[0];
      const newUser = { 
        id: Date.now(), 
        name, 
        email, 
        password,
        username 
      };
      
      await AsyncStorage.setItem('users', JSON.stringify([...parsedUsers, newUser]));
      
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Erro ao criar conta');
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#424242" />
        </BackButton>
        <Title>Criar Nova Conta</Title>
      </Header>

      <ContentContainer>
        <Label>Nome de usuário</Label>
        <Input
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          placeholder="Digite seu nome"
          placeholderTextColor="#A0A0A0"
        />

        <Label>Email</Label>
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
      </ContentContainer>

      <Button onPress={handleCreateUser}>
        <ButtonText>Criar Conta</ButtonText>
      </Button>
    </Container>
  );
} 