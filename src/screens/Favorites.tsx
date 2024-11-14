import React, { useState } from 'react';
import styled from 'styled-components/native';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { PostCard } from '../components/PostCard';
import { SearchBar } from '../components/SearchBar';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { MaterialIcons } from '@expo/vector-icons';
import { BottomTab } from '../components/BottomTab';
import { useTheme } from 'styled-components';
import { Post } from '../types/post';


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

const FloatingButton = styled.TouchableOpacity`
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

const EmptyState = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const EmptyStateText = styled.Text`
  font-size: 16px;
  color: #666;
  text-align: center;
  margin-top: 10px;
`;

const SearchButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SearchContainer = styled.View`
  padding: 0 16px;
  margin-bottom: 8px;
  margin-top: 8px;
`;

const StyledFlatList = styled(FlatList<Post>)`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default function Favorites() {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const dispatch = useDispatch();
  const theme = useTheme();
  
  const posts = useSelector((state: RootState) => state.posts.items);
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  
  const favoritePosts = posts.filter(post => favoriteIds.includes(post.id));
  
  const filteredPosts = favoritePosts.filter(post => {
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

  const handleCreatePost = () => {
    navigation.navigate('CreatePost');
  };

  const renderEmptyState = () => (
    <EmptyState>
      <MaterialIcons name="star-border" size={48} color="#666" />
      <EmptyStateText>
        Você ainda não tem favoritos.{'\n'}
        Favorite alguns posts para vê-los aqui!
      </EmptyStateText>
    </EmptyState>
  );

  return (
    <Container>
      {!showSearch ? (
        <Header>
        <Title>Favoritos</Title>
        <SearchButton onPress={() => setShowSearch(true)}>
          <MaterialIcons name="search" size={24} color="#424242" />
        </SearchButton>
      </Header>
      ) : (
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onCancel={handleCancelSearch}
          placeholder="Buscar nos favoritos..."
        />
      )}

      <StyledFlatList
        data={normalizedPosts}
        renderItem={({ item }: { item: Post }) => (
          <PostCard
            post={item}
            onPress={() => navigation.navigate('ViewPost', { postId: item.id })}
            onFavorite={() => dispatch(toggleFavorite(item.id))}
            isFavorite={true}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={renderEmptyState}
      />
      <FloatingButton onPress={handleCreatePost}>
        <MaterialIcons name="add" size={24} color="white" />
      </FloatingButton>
      <BottomTab />
    </Container>
  );
} 