import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {useAuth} from '../context/AuthContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Auth Screens
import LoginScreen from '../screens/Auth/LoginScreen';
import OnboardingScreen from '../screens/Auth/OnboardingScreen';

// Main Screens
import DiscoverScreen from '../screens/Discover/DiscoverScreen';
import MatchesScreen from '../screens/Matches/MatchesScreen';
import MessagesListScreen from '../screens/Messages/MessagesListScreen';
import ChatScreen from '../screens/Messages/ChatScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import SubscriptionScreen from '../screens/Subscription/SubscriptionScreen';
import GroupsScreen from '../screens/Groups/GroupsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let iconName;

          if (route.name === 'Discover') {
            iconName = 'search';
          } else if (route.name === 'Matches') {
            iconName = 'favorite';
          } else if (route.name === 'Messages') {
            iconName = 'chat';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#9CA3AF',
        headerShown: false,
      })}>
      <Tab.Screen name="Discover" component={DiscoverScreen} />
      <Tab.Screen name="Matches" component={MatchesScreen} />
      <Tab.Screen name="Messages" component={MessagesListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const {isAuthenticated, isLoading} = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={{headerShown: true, title: 'Chat'}}
          />
          <Stack.Screen 
            name="Subscription" 
            component={SubscriptionScreen}
            options={{headerShown: true, title: 'Subscription'}}
          />
          <Stack.Screen 
            name="Groups" 
            component={GroupsScreen}
            options={{headerShown: true, title: 'Groups'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

