import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.medium}px;
  justify-content: flex-start;
  padding-top: 20%;
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
  top: 80px;
  left: 16px;
  padding: 12px;
  z-index: 1;
`;

export const Title = styled.Text`
  font-size: 42px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-top: 40px;
  margin-bottom: 50px;
  letter-spacing: 0.5px;
`;

export const Input = styled.TextInput`
  background-color: #E8E8EA;
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.medium}px;
  margin-bottom: ${({ theme }) => theme.spacing.medium}px;
  font-size: ${({ theme }) => theme.typography.fontSize.medium}px;
  color: #1C1C1E;
`;

export const Label = styled.Text`
  font-size: 16px;
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.small}px;
  color: #3A3A3C;
`;

export const Button = styled.TouchableOpacity`
  background-color: #4A90E2;
  padding: ${({ theme }) => theme.spacing.medium}px;
  border-radius: 25px;
  align-items: center;
  margin-vertical: ${({ theme }) => theme.spacing.medium}px;
`;

export const ButtonText = styled.Text`
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 0.5px;
`;

export const LinkText = styled.Text`
  color: #4A90E2;
  font-size: 14px;
  font-weight: 400;
  margin-top: 16px;
  text-align: center;
`; 