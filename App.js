import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {AuthProvider} from './src/contexts/AuthContext';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <PaperProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
