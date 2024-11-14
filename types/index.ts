export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Post {
  id: number;
  title: string;
  content?: string;
  body?: string;
  userId: number;
  isLocal?: boolean;
} 