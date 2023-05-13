import Ionicons from '@expo/vector-icons/Ionicons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import ChatsScreen from './screens/chats.screen';
import ContactsScreen from './screens/contacts.screen';
import CreateUser from './screens/create-user.screen';
import Login from './screens/login.screen';
import UserSettingScreen from './screens/usersettings.screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const isLoggedIn = false;

function Main() {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, colour, size }) => {
          colour = '#4f46e5'
          let iconName;
          if (route.name === 'Contacts') {
            iconName = focused
            ? 'person'
            : 'person-outline'
          } else if (route.name === 'Chats') {
            iconName = focused ? 'chatbox' : 'chatbox-outline';
          } else if (route.name === 'User Settings') {
            iconName = focused ? 'settings' : 'settings-outline'
          }

          return <Ionicons name={iconName} size={size} color={colour} />
        },
        tabBarActiveTintColor: '#4f46e5',
        tabBarInactiveTintColor: '#4f46e5',
      })}>
        <Tab.Screen name='Chats' component={ChatsScreen} options={{ headerShown: false }} />
        <Tab.Screen name='Contacts' component={ContactsScreen} />
        {/* <Tab.Screen name='Contact' component={ContactScreen} /> */}
        {/* <Tab.Screen name='Chat' component={ChatScreen} /> */}
        {/* <Tab.Screen name='Blocked' component={BlockedScreen} /> */}
        <Tab.Screen name='User Settings' component={UserSettingScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group screenOptions={{headerShown: false}}>
          <Stack.Screen 
            name='Login'
            component={Login}
          />
          <Stack.Screen
            name='CreateUser'
            component={CreateUser}
          />
        </Stack.Group>
        <Stack.Group>
          <Stack.Screen 
            name="Main"
            component={Main}
            options={{ headerShown: false }}
          />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  );
}