import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { PostsService } from '../services/api';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { addLocalPost } from '../store/slices/postsSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
};

type CreatePostNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: #FFF;
  padding: 16px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  padding-top: 24px;
`;

const HeaderTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: #2C3E50;
  margin-left: 16px;
`;

const CloseButton = styled.TouchableOpacity`
  padding: 8px;
`;

const Input = styled.TextInput`
  background-color: #E8EAF6;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 16px;
  color: #2C3E50;
`;

const TextArea = styled(Input)`
  height: 500px;
  text-align-vertical: top;
`;

const PublishButton = styled.TouchableOpacity`
  background-color: #4A90E2;
  padding: 16px;
  border-radius: 30px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin: 0 0px;
`;

const ButtonText = styled.Text`
  color: white;
  font-weight: 600;
  font-size: 16px;
  margin-right: 8px;
`;

const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  color: #2C3E50;
  margin-bottom: 8px;
`;

const Divider = styled.View`
  height: 1px;
  background-color: #E0E0E0;
  width: 100%;
  margin-bottom: 16px;
`;

export default function CreatePost() {
  const navigation = useNavigation<CreatePostNavigationProp>();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    getCurrentUser();
  }, []);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (!currentUser) {
      Alert.alert('Erro', 'Usuário não encontrado');
      return;
    }

    setLoading(true);
    try {
      const newPost = {
        title,
        body: content,
        userId: currentUser.id
      };

      const response = await PostsService.createPost(newPost);
      
      dispatch(addLocalPost({
        ...response.data,
        id: Date.now(),
        content: content,
        body: content,
        userId: currentUser.id
      }));
      
      Alert.alert('Sucesso', 'Post criado com sucesso!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <CloseButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#2C3E50" />
        </CloseButton>
        <HeaderTitle>Nova Publicação</HeaderTitle>
      </Header>
      <Divider />
      <Label>Título da publicação</Label>
      <Input
        placeholder="Digite o título..."
        placeholderTextColor="#8E9AAF"
        value={title}
        onChangeText={setTitle}
      />
      
      <Label>Texto da publicação</Label>
      <TextArea
        placeholder="Digite o texto..."
        placeholderTextColor="#8E9AAF"
        value={content}
        onChangeText={setContent}
        multiline
      />

      <PublishButton onPress={handleSubmit} disabled={loading}>
      <MaterialIcons name="send" size={20} color="#FFF" />
        <ButtonText>Publicar</ButtonText>
      </PublishButton>
    </Container>
  );
}