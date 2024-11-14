import React, { useState, useEffect } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import styled from 'styled-components/native';
import { useTheme } from 'styled-components/native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { PostCard } from '../components/PostCard';
import { UsersService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post, User } from '../types';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

type UserProfileRouteProp = RouteProp<{
  UserProfile: {
    userId: number;
    isLocal: boolean;
  };
}, 'UserProfile'>;

type RootStackParamList = {
  ViewPost: { postId: number };
  UserProfile: { userId: number; isLocal: boolean };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const ScrollContainer = styled.ScrollView`
  flex: 1;
`;

const ProfileSection = styled.View`
  background-color: white;
  elevation: 2;
  margin-bottom: 8px;
`;

const AvatarSection = styled.View`
  flex-direction: row;
  padding: 16px;
  padding-bottom: 0;
`;

const Avatar = styled.Image`
  width: 80px;
  height: 80px;
  border-radius: 40px;
`;

const UserInfoContainer = styled.View`
  margin-left: 16px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 20px;
  padding-top: 10px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
  margin-bottom: 4px;
`;

const UserHandle = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.7;
  margin-bottom: 16px;
`;

const ContactSection = styled.View`
  margin-top: 24px;
  padding: 0 16px 16px 16px;
`;

const DetailRow = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
`;

const DetailIcon = styled.View`
  width: 24px;
  margin-right: 12px;
  opacity: 0.7;
`;

const DetailText = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.8;
`;

const PostsSection = styled.View`
  padding-top: 16px;
  padding-bottom: 16px;
`;

const SectionTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 16px;
  color: ${({ theme }) => theme.colors.text};
`;

const HeaderFixed = styled.View`
  background-color: ${({ theme }) => theme.colors.background};
  border-bottom-width: 1px;
  border-bottom-color: ${({ theme }) => theme.colors.text};
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  padding-top: 50px;
  padding-bottom: 12px;
  background-color: white;
  elevation: 2;
  margin-bottom: 5px;
`;

const BackButton = styled.TouchableOpacity`
  margin-right: 16px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 400;
  color: #424242;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 8px;
`;

const UserInfoSection = styled.View`
  align-items: center;
  margin-bottom: 16px;
`;

export default function UserProfile() {
  const theme = useTheme();
  const route = useRoute<UserProfileRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const allPosts = useSelector((state: RootState) => state.posts.items);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const loadUserData = async () => {
    try {
      if (route.params.isLocal) {
        const currentUserStr = await AsyncStorage.getItem('currentUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        setUser(currentUser);
        
        const localPosts = allPosts.filter(post => 
          post.isLocal && post.userId === currentUser?.id
        );
        setUserPosts(localPosts);
      } else {
        const [userResponse, postsResponse] = await Promise.all([
          UsersService.getUser(route.params.userId),
          UsersService.getUserPosts(route.params.userId)
        ]);
        
        setUser(userResponse.data);
        setUserPosts(postsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [route.params.userId, route.params.isLocal]);

  const handlePostPress = (postId: number) => {
    navigation.navigate('ViewPost', { postId });
  };

  const handlePostFavorite = (postId: number) => {
    dispatch(toggleFavorite(postId));
  };

  const handleCancelSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  if (loading) {
    return (
      <Container>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#424242" />
        </BackButton>
        <Title>Perfil</Title>
      </Header>
      
      <ScrollContainer>
        <ProfileSection>
          <AvatarSection>
            <Avatar source={{ uri: 'https://thispersondoesnotexist.com' }} />
            <UserInfoContainer>
              <UserName>{user?.name || 'Usuário'}</UserName>
              <UserHandle>
                @{user?.username || user?.email?.split('@')[0] || 'usuario'}
              </UserHandle>
            </UserInfoContainer>
          </AvatarSection>
          <ContactSection>
            <DetailRow>
              <DetailIcon>
                <MaterialIcons name="mail-outline" size={20} color={theme.colors.text} />
              </DetailIcon>
              <DetailText>{user?.email}</DetailText>
            </DetailRow>
            <DetailRow>
              <DetailIcon>
                <MaterialIcons name="location-on" size={20} color={theme.colors.text} />
              </DetailIcon>
              <DetailText>São Paulo, SP</DetailText>
            </DetailRow>
            <DetailRow>
              <DetailIcon>
                <MaterialIcons name="work-outline" size={20} color={theme.colors.text} />
              </DetailIcon>
              <DetailText>Desenvolvedor Frontend</DetailText>
            </DetailRow>
            <DetailRow>
              <DetailIcon>
                <MaterialIcons name="phone" size={20} color={theme.colors.text} />
              </DetailIcon>
              <DetailText>(11) 99999-9999</DetailText>
            </DetailRow>
          </ContactSection>
        </ProfileSection>
        <PostsSection>
          <FlatList
            data={userPosts}
            renderItem={({ item }) => (
              <PostCard
                post={{
                  ...item,
                  body: item.body || item.content || '',
                  isLocal: item.isLocal
                }}
                onPress={() => handlePostPress(item.id)}
                onFavorite={() => handlePostFavorite(item.id)}
                isFavorite={favoriteIds.includes(item.id)}
              />
            )}
            keyExtractor={item => String(item.id)}
            scrollEnabled={false}
          />
        </PostsSection>
      </ScrollContainer>
    </Container>
  );
} 