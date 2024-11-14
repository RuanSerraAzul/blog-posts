import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Post } from './post';

export type RootStackParamList = {
  Home: undefined;
  ViewPost: { postId: number };
  CreatePost: undefined;
  UserProfile: {
    userId: number;
    isLocal: boolean;
  };
  Favorites: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>; 