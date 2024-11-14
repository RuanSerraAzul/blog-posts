import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity, Animated, TouchableWithoutFeedback } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Post } from '../types/post';
import { RootStackParamList } from '../types/navigation';
import { useUser } from '../hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/index';
import { useAnimation } from '../hooks/useAnimation';

const Card = styled(Animated.View)`
  background-color: white;
  margin: 8px 16px;
  padding: 12px;
  elevation: 2;
  position: relative;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 12px;
  margin-right: 32px;
`;

const Avatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
`;

const UserInfo = styled.View`
  margin-left: 12px;
  flex: 1;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: 400;
  color: #666666;
  margin-bottom: 2px;
`;

const UserHandle = styled.Text`
  font-size: 14px;
  color: #757575;
`;

const PostTitle = styled.Text`
  font-size: 18px;
  font-weight: 500;
  color: #424242;
  margin-vertical: 8px;
`;

const PostContent = styled.Text`
  font-size: 15px;
  color: #9E9E9E;
  line-height: 20px;
`;

const FavoriteButton = styled.TouchableOpacity`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  background-color: white;
  padding: 4px;
  border-radius: 12px;
`;

interface PostCardProps {
  post: Post & { isLocal?: boolean };
  onPress: () => void;
  onFavorite: () => void;
  isFavorite: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onPress,
  onFavorite,
  isFavorite,
}) => {
  const { user } = useUser(post.userId);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const scale = useAnimation(1);
  const favorite = useAnimation(1);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    getCurrentUser();
  }, []);

  const displayUser = post.isLocal && currentUser 
    ? currentUser 
    : user;

  const handleAvatarPress = () => {
    navigation.navigate('UserProfile', { 
      userId: post.userId,
      isLocal: post.isLocal || false
    });
  };

  const handlePressIn = () => {
    scale.animate(0.98);
  };

  const handlePressOut = () => {
    scale.animate(1);
  };

  const handleFavorite = () => {
    favorite.animate(1.3);
    setTimeout(() => favorite.animate(1), 200);
    onFavorite();
  };

  return (
    <TouchableWithoutFeedback 
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Card style={{ transform: [{ scale: scale.animatedValue }] }}>
        <FavoriteButton onPress={handleFavorite}>
          <Animated.View style={{ transform: [{ scale: favorite.animatedValue }] }}>
            <MaterialIcons
              name={isFavorite ? 'star' : 'star-border'}
              size={24}
              color={isFavorite ? '#FFD700' : '#757575'}
            />
          </Animated.View>
        </FavoriteButton>
        <Header>
          <TouchableOpacity onPress={handleAvatarPress}>
            <Avatar source={{ uri: 'https://thispersondoesnotexist.com' }} />
          </TouchableOpacity>
          <UserInfo>
            <UserName>{displayUser?.name || 'Usuário'}</UserName>
            <UserHandle>
              @{displayUser?.username || displayUser?.email?.split('@')[0] || 'usuario'}
            </UserHandle>
          </UserInfo>
        </Header>
        <PostTitle>{post.title}</PostTitle>
        <PostContent numberOfLines={3}>{post.body || post.content}</PostContent>
      </Card>
    </TouchableWithoutFeedback>
  );
};
