export const theme = {
  colors: {
    primary: '#007AFF',
    background: '#F5F5F5',
    text: '#000000',
    lightGray: '#E5E5E5',
    gray: '#666666',
    cardBackground: '#FFFFFF'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  },
  typography: {
    fontSize: {
      small: 12,
      medium: 16,
      large: 24
    },
    body: {
      fontSize: 16,
      // outras propriedades de estilo que você queira definir
    }
  }
};

export type Theme = typeof theme; 