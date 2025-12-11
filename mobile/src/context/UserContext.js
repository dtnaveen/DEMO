import React, {createContext, useState, useContext, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getCurrentUser, updateUser} from '../services/api';

const UserContext = createContext();

export function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        setCurrentUser(JSON.parse(userData));
      } else {
        // Fetch from API
        const user = await getCurrentUser();
        setCurrentUser(user);
        await AsyncStorage.setItem('userData', JSON.stringify(user));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCurrentUser = async (userData) => {
    try {
      const updatedUser = await updateUser(userData);
      setCurrentUser(updatedUser);
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
      return {success: true};
    } catch (error) {
      return {success: false, error: error.message};
    }
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isLoading,
        updateCurrentUser,
        refreshUser: loadUser,
      }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
}

