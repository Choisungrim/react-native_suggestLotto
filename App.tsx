// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import HistoryScreen from './screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: '🎯 AI 로또 추천' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: '📜 회차 기록' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
