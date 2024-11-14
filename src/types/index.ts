export interface User {
    id: number;
    name: string;
    email: string;
    username?: string;
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
  
  export interface Comment {
    id: number;
    postId: number;
    name: string;
    email: string;
    body: string;
  }
  
  export interface CommentData {
    name: string;
    email: string;
    body: string;
  }