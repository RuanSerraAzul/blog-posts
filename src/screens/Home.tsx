import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, Text, ActivityIndicator, FlatList, Animated, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import styled from 'styled-components/native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { NavigationProps } from '../types/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setLoading, setPosts, setError } from '../store/slices/postsSlice';
import { PostsService } from '../services/posts';
import { SearchBar } from '../components/SearchBar';
import { toggleFavorite, setFavorites } from '../store/slices/favoritesSlice';
import { PostCard } from '../components/PostCard';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTab } from '../components/BottomTab';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '../types/post';
import { useAnimation } from '../hooks/useAnimation';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  padding-top: 40px;
  padding-bottom: 12px;
  background-color: white;
  elevation: 2;
  margin-bottom: 5px;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: 400;
  color: #424242;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SearchContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const FloatingButton = styled(Animated.View)`
  position: absolute;
  right: 20px;
  bottom: 80px;
  width: 56px;
  height: 56px;
  border-radius: 28px;
  background-color: ${({ theme }) => theme.colors.primary};
  justify-content: center;
  align-items: center;
  elevation: 5;
`;

const StyledFlatList = styled(FlatList)`
  ${({ theme }) => `
    padding-top: 4px;
  `}
` as typeof FlatList;

const Home = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProps>();
  const dispatch = useDispatch<AppDispatch>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { items: posts, loading } = useSelector((state: RootState) => state.posts);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const [showSearch, setShowSearch] = useState(false);
  const buttonScale = useAnimation(1);

  useEffect(() => {
    const loadPosts = async () => {
      dispatch(setLoading(true));
      try {
        const response = await PostsService.getPosts();
        const apiPosts = response.data.map(post => ({
          ...post,
          content: post.body,
          isLocal: false
        }));

        const localPostsStr = await AsyncStorage.getItem('localPosts');
        const localPosts = localPostsStr ? JSON.parse(localPostsStr).map((post: Post) => ({
          ...post,
          isLocal: true
        })) : [];

        dispatch(setPosts(localPosts.concat(apiPosts)));
      } catch (error) {
        dispatch(setError('Erro ao carregar posts'));
      }
    };
    loadPosts();
  }, [dispatch]);

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('@favorites');
        if (savedFavorites) {
          dispatch(setFavorites(JSON.parse(savedFavorites)));
        }
      } catch (error) {
        console.error('Erro ao carregar favoritos:', error);
      }
    };
    
    loadFavorites();
  }, [dispatch]);

  const filteredPosts = posts.filter(post => {
    const searchTermLower = searchQuery.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(searchTermLower);
    const contentMatch = (post.body || post.content || '')
      .toLowerCase()
      .includes(searchTermLower);
    
    return titleMatch || contentMatch;
  });

  const handleCancelSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const normalizedPosts = filteredPosts.map(post => ({
    ...post,
    body: post.body || post.content || '',
    content: post.content || post.body || '',
  }));

  const handleCreatePostPress = () => {
    buttonScale.animate(0.9);
    setTimeout(() => {
      buttonScale.animate(1);
      navigation.navigate('CreatePost');
    }, 100);
  };

  return (
    <Container>
      {!showSearch ? (
        <Header>
          <Title>Início</Title>
          <SearchButton onPress={() => setShowSearch(true)}>
            <MaterialIcons name="search" size={24} color="#424242" />
          </SearchButton>
        </Header>
      ) : (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onCancel={handleCancelSearch}
          placeholder="Buscar posts..."
        />
      )}
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <StyledFlatList
          data={normalizedPosts}
          renderItem={({ item }: { item: Post }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate('ViewPost', { postId: item.id })}
              onFavorite={() => dispatch(toggleFavorite(item.id))}
              isFavorite={favoriteIds.includes(item.id)}
            />
          )}
          keyExtractor={item => item.id.toString()}
        />
      )}
      <FloatingButton 
        style={{ transform: [{ scale: buttonScale.animatedValue }] }}
        as={TouchableWithoutFeedback}
        onPress={handleCreatePostPress}
      >
        <MaterialIcons name="add" size={24} color="white" />
      </FloatingButton>
      <BottomTab />
    </Container>
  );
};

export default Home; 