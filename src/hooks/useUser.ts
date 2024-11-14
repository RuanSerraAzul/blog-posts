import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsersService } from '../services/api';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export function useUser(userId?: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        // Primeiro, tenta buscar do Storage
        const currentUserStr = await AsyncStorage.getItem('currentUser');
        if (currentUserStr) {
          const currentUser = JSON.parse(currentUserStr);
          if (currentUser.id === userId) {
            setUser(currentUser);
            setLoading(false);
            return;
          }
        }

        const usersData = await AsyncStorage.getItem('users');
        if (usersData) {
          const users = JSON.parse(usersData);
          const localUser = users.find((u: User) => u.id === userId);
          if (localUser) {
            setUser(localUser);
            setLoading(false);
            return;
          }
        }

        // Se não encontrar no Storage, busca da API
        const response = await UsersService.getUser(userId);
        setUser(response.data);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [userId]);

  return { user, loading };
} 