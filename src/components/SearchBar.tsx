import React from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 16px;
  padding-top: 40px;
  padding-bottom: 14px;
  background-color: white;
  elevation: 2;
`;

const Input = styled.TextInput`
  flex: 1;
  font-size: 16px;
  color: #333;
`;

const CancelButton = styled.Text`
  color: #007AFF;
  font-size: 16px;
  margin-left: 12px;
`;

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onCancel,
  placeholder
}) => (
  <Container>
    <Input
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      autoFocus
    />
    <TouchableOpacity onPress={onCancel}>
      <CancelButton>Cancel</CancelButton>
    </TouchableOpacity>
  </Container>
); 