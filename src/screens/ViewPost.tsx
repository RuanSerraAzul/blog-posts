import React, { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Animated, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import { PostsService } from '../services/api';
import { Post, Comment } from '../types';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { toggleFavorite } from '../store/slices/favoritesSlice';
import { useUser } from '../hooks/useUser';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { store } from '../store';
import { useAnimation } from '../hooks/useAnimation';

const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const HeaderFixed = styled.View`
  background-color: white;
  elevation: 2;
`;

const ContentScrollView = styled.ScrollView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: 70px;
`;

const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding-top: 38px;
  padding-horizontal: 16px;
  padding-bottom: 8px;
  background-color: white;
`;

const BackButton = styled.TouchableOpacity`
  padding: 8px;
`;

const HeaderTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: #2C3E50;
  margin-left: 16px;
`;

const Divider = styled.View`
  height: 0.5px;
  background-color: #E0E0E0;
  width: 100%;
  margin-bottom: 0px;
`;

const PostContent = styled.View`
  padding: 16px;
  background-color: white;
`;

const PostTitle = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
`;

const PostBody = styled.Text`
  font-size: 16px;
  color: #444;
  line-height: 24px;
`;

const CommentsSection = styled.View`
  margin-top: 0px;
  background-color: white;
  padding: 16px;
`;

const CommentHeader = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 12px;
`;

const CommentItem = styled.View`
  flex-direction: row;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom-width: 0.5px;
  border-bottom-color: #E0E0E0;
`;

const CommentAvatar = styled.Image`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  margin-right: 12px;
`;

const CommentContent = styled.View`
  flex: 1;
`;

const CommentAuthor = styled.Text`
  font-size: 15px;
  color: #999;
  margin-bottom: 8px;
`;

const CommentText = styled.Text`
  font-size: 14px;
  color: #444;
  line-height: 20px;
`;

const PostUserSection = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  background-color: white;
`;

const UserAvatar = styled.Image`
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-right: 12px;
`;

const UserInfo = styled.View`
  flex: 1;
`;

const FavoriteButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SectionDivider = styled.View`
  height: 0.5px;
  background-color: ${({ theme }) => theme.colors.background};
  width: 100%;
`;

const UserName = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const UserHandle = styled.Text`
  font-size: 14px;
  color: #757575;
`;

const CommentInputContainer = styled(Animated.View)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: row;
  align-items: center;
  padding: 12px 16px;
  background-color: white;
  border-top-width: 0.5px;
  border-top-color: #E0E0E0;
  elevation: 5;
`;

const CommentInputWrapper = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 20px;
  padding: 8px 12px;
  margin-right: 8px;
`;

const StyledCommentInput = styled.TextInput`
  flex: 1;
  font-size: 15px;
  color: #333;
  margin-left: 8px;
`;

const MediaButton = styled.TouchableOpacity`
  padding: 8px;
`;

const SendButton = styled(Animated.View)`
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

export default function ViewPost() {
  const route = useRoute<RouteProp<{ ViewPost: { postId: number } }, 'ViewPost'>>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const dispatch = useDispatch();
  const favoriteIds = useSelector((state: RootState) => state.favorites.ids);
  const { user } = useUser(post?.userId);
  const navigation = useNavigation();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const inputTranslateY = useAnimation(0);
  const sendScale = useAnimation(1);

  useEffect(() => {
    const getCurrentUser = async () => {
      const userStr = await AsyncStorage.getItem('currentUser');
      if (userStr) {
        setCurrentUser(JSON.parse(userStr));
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    loadPostData();
  }, [route.params.postId]);

  useEffect(() => {
    const keyboardDidShow = () => {
      inputTranslateY.animate(-100);
    };

    const keyboardDidHide = () => {
      inputTranslateY.animate(0);
    };

    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow);
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide);

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const loadPostData = async () => {
    try {
      const localPosts = store.getState().posts.items;
      const localPost = localPosts.find(p => p.id === route.params.postId);

      if (localPost && localPost.isLocal) {
        const currentUserStr = await AsyncStorage.getItem('currentUser');
        const currentUser = currentUserStr ? JSON.parse(currentUserStr) : null;
        
        setPost({
          id: localPost.id,
          title: localPost.title,
          body: localPost.body || localPost.content || '',
          userId: currentUser?.id,
          isLocal: true
        });
        setComments([]);
      } else {
        const [postResponse, commentsResponse] = await Promise.all([
          PostsService.getPost(route.params.postId),
          PostsService.getComments(route.params.postId)
        ]);
        setPost({
          ...postResponse.data,
          body: postResponse.data.body,
          userId: postResponse.data.userId,
          isLocal: false
        });
        setComments(commentsResponse.data);
      }
    } catch (error) {
      console.error('Erro ao carregar post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;

    const newCommentObj = {
      id: Date.now(),
      postId: post.id,
      body: newComment,
      name: currentUser?.name || 'Usuário Anônimo',
      email: currentUser?.email || 'anonimo@email.com'
    };

    setComments(prev => [...prev, newCommentObj]);
    setNewComment('');
  };

  const handleSendComment = () => {
    sendScale.animate(0.9);
    setTimeout(() => {
      sendScale.animate(1);
      handleAddComment();
    }, 100);
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  const userHandle = post?.isLocal 
    ? user?.email?.split('@')[0] || 'usuario'
    : user?.username || 'usuario';

  return (
    <Container>
      <HeaderFixed>
        <Header>
          <BackButton onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#2C3E50" />
          </BackButton>
          <HeaderTitle>Publicação</HeaderTitle>
        </Header>
        <Divider />
      </HeaderFixed>

      <ContentScrollView>
        <PostUserSection>
          <UserAvatar source={{ uri: 'https://thispersondoesnotexist.com' }} />
          <UserInfo>
            <UserName>{user?.name || 'Usuário'}</UserName>
            <UserHandle>@{userHandle}</UserHandle>
          </UserInfo>
          <FavoriteButton onPress={() => post && dispatch(toggleFavorite(post.id))}>
            <MaterialIcons
              name={post && favoriteIds.includes(post.id) ? 'star' : 'star-border'}
              size={24}
              color={post && favoriteIds.includes(post.id) ? '#FFD700' : '#757575'}
            />
          </FavoriteButton>
        </PostUserSection>

        <PostContent>
          <PostTitle>{post?.title}</PostTitle>
          <PostBody>{post?.body}</PostBody>
        </PostContent>

        <SectionDivider />

        <CommentsSection>
          <CommentHeader>Comentários</CommentHeader>
          {comments.map((comment, index) => (
            <CommentItem key={index}>
              <CommentAvatar source={{ uri: `https://ui-avatars.com/api/?name=${comment.name}` }} />
              <CommentContent>
                <CommentAuthor>{comment.email}</CommentAuthor>
                <CommentText>{comment.body}</CommentText>
              </CommentContent>
            </CommentItem>
          ))}
        </CommentsSection>
      </ContentScrollView>

      <CommentInputContainer 
        style={{ transform: [{ translateY: inputTranslateY.animatedValue }] }}
      >
        <CommentInputWrapper>
          <MediaButton onPress={() => {/* Implementar seleção de mídia */}}>
            <MaterialIcons name="image" size={24} color="#666" />
          </MediaButton>
          <StyledCommentInput
            value={newComment}
            onChangeText={setNewComment}
            placeholder="Adicione um comentário..."
            placeholderTextColor="#999"
            multiline
          />
        </CommentInputWrapper>
        {newComment.trim().length > 0 && (
          <SendButton 
            style={{ transform: [{ scale: sendScale.animatedValue }] }}
            as={TouchableWithoutFeedback}
            onPress={handleSendComment}
          >
            <MaterialIcons name="send" size={20} color="#FFF" />
          </SendButton>
        )}
      </CommentInputContainer>
    </Container>
  );
} 