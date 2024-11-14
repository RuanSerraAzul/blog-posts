import 'styled-components/native';

declare module 'styled-components/native' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      background: string;
      text: string;
    };
    spacing: {
      small: number;
      medium: number;
      large: number;
    };
    typography: {
      fontSize: {
        small: number;
        medium: number;
        large: number;
      };
    };
  }
} 