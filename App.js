import * as React from 'react';
import {PaperProvider} from 'react-native-paper';
import {theme} from './src/constants/theme';
import {AuthProvider} from './src/contexts/AuthContext';
import RootNavigator from './src/navigation';

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  );
}
