import React from 'react';
import styled from 'styled-components/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
};

const Container = styled.View`
  flex-direction: row;
  height: 60px;
  background-color: white;
  border-top-width: 1px;
  border-top-color: #E5E5E5;
`;

const TabButton = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const TabLabel = styled.Text<{ active: boolean }>`
  font-size: 12px;
  margin-top: 4px;
  color: ${props => props.active ? '#007AFF' : '#757575'};
`;

const BottomTab: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();

  return (
    <Container>
      <TabButton onPress={() => navigation.navigate('Home')}>
        <MaterialCommunityIcons
          name={route.name === 'Home' ? 'home' : 'home-outline'}
          size={28}
          color={route.name === 'Home' ? '#007AFF' : '#757575'}
        />
        <TabLabel active={route.name === 'Home'}>Home</TabLabel>
      </TabButton>

      <TabButton onPress={() => navigation.navigate('Favorites')}>
        <MaterialCommunityIcons
          name={route.name === 'Favorites' ? 'star' : 'star-outline'}
          size={28}
          color={route.name === 'Favorites' ? '#007AFF' : '#757575'}
        />
        <TabLabel active={route.name === 'Favorites'}>Favorites</TabLabel>
      </TabButton>
    </Container>
  );
};

export { BottomTab };
