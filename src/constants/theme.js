import {MD3LightTheme as DefaultTheme} from 'react-native-paper';

const fontConfig = {
  fontFamily: 'FiraSans-Regular',
  displayLarge: {
    fontFamily: 'FiraSans-Bold',
    fontWeight: '700',
    fontSize: 32,
  },
  bodyMedium: {
    fontFamily: 'Urbanist-Regular',
    fontWeight: '400',
    fontSize: 16,
  },
  labelLarge: {
    fontFamily: 'FiraSans-Medium',
    fontWeight: '500',
    fontSize: 14,
  },
};

export const theme = {
  ...DefaultTheme,
  fonts: {
    ...DefaultTheme.fonts,
    ...fontConfig,
  },
};
