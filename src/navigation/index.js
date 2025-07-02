import React, {useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createMaterialBottomTabNavigator} from 'react-native-paper/react-navigation';
import MaterialDesignIcons from '@react-native-vector-icons/material-design-icons';
import {AuthContext} from '../contexts/AuthContext';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Main/HomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';
import OpnameScreen from '../screens/Main/OpnameScreen';
import ProcessOpnameScreen from '../screens/Main/OpnameScreen/ProcessOpnameScreen';
import HelpScreen from '../screens/Main/HelpScreen';

const AppStack = createMaterialBottomTabNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function AuthStackScreen() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

function AppStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{headerShown: false}}>
      <MainStack.Screen name="MainTabs" component={MainTabNavigator} />
      <MainStack.Screen name="ProcessOpname" component={ProcessOpnameScreen} />
    </MainStack.Navigator>
  );
}

function MainTabNavigator() {
  return (
    <AppStack.Navigator
      initialRouteName="Home"
      activeColor="#6366f1"
      barStyle={{backgroundColor: '#ffffff'}}>
      <AppStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color}) => (
            <MaterialDesignIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <AppStack.Screen
        name="Opname"
        component={OpnameStackScreen}
        options={{
          tabBarLabel: 'Opname',
          tabBarIcon: ({color}) => (
            <MaterialDesignIcons
              name="clipboard-text-search"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <AppStack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialDesignIcons name="account" color={color} size={26} />
          ),
        }}
      />
      <AppStack.Screen
        name="Help"
        component={HelpScreen}
        options={{
          tabBarLabel: 'Help Center',
          tabBarIcon: ({color}) => (
            <MaterialDesignIcons name="help-circle" color={color} size={26} />
          ),
        }}
      />
    </AppStack.Navigator>
  );
}

function OpnameStackScreen() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="OpnameMain" component={OpnameScreen} />
      <Stack.Screen name="ProcessOpname" component={ProcessOpnameScreen} />
    </Stack.Navigator>
  );
}

export default function RootNavigator() {
  const {isAuthenticated} = useContext(AuthContext);

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStackScreen /> : <AuthStackScreen />}
    </NavigationContainer>
  );
}
