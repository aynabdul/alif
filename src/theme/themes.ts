import { DefaultTheme, DarkTheme, Theme } from '@react-navigation/native';
import { StatusBarStyle } from 'expo-status-bar';
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Define our custom theme structure
export interface CustomTheme {
  country: 'US' | 'PAK';
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    background: string;
    card: string;
    cardBackground: string;
    text: string;
    textSecondary: string;
    border: string;
    notification: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    brand: string;
    primaryShades: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
    grays: {
      50: string;
      100: string;
      200: string;
      300: string;
      400: string;
      500: string;
      600: string;
      700: string;
      800: string;
      900: string;
      950: string;
    };
  };
  spacing: {
    xs: number;
    s: number;
    m: number;
    l: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    small: number;
    medium: number;
    large: number;
  };
  statusBarStyle: StatusBarStyle;
  navigationTheme?: Theme;
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
}

// Pakistan theme definition (Maroon + Grays)
export const pakTheme: CustomTheme = {
  country: 'PAK',
  colors: {
    primary: '#8A2D25', // Maroon
    primaryDark: '#6D241D',
    primaryLight: '#E39D96',
    secondary: '#AAAAAA', // Gray
    background: '#FFFFFF',
    card: '#FFFFFF',
    cardBackground: '#F7F7F7',
    text: '#212121',
    textSecondary: '#666666',
    border: '#DEDEDE',
    notification: '#BD3E33',
    error: '#BD3E33',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    brand: '#8A2D25',
    primaryShades: {
      50: "#F7E5E3",
      100: "#F1CECB",
      200: "#E39D96",
      300: "#D56C62",
      400: "#BD3E33",
      500: "#8A2D25",
      600: "#6D241D",
      700: "#541C17",
      800: "#38130F",
      900: "#1C0908",
      950: "#0C0403"
    },
    grays: {
      50: "#F7F7F7",
      100: "#EDEDED",
      200: "#DEDEDE",
      300: "#CCCCCC",
      400: "#BABABA",
      500: "#AAAAAA",
      600: "#878787",
      700: "#666666",
      800: "#454545",
      900: "#212121",
      950: "#121212"
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
  statusBarStyle: 'dark',
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  navigationTheme: {
    dark: false,
    colors: {
      primary: '#8A2D25',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#212121',
      border: '#DEDEDE',
      notification: '#BD3E33',
    },
  },
};

// USA theme definition (Green + Grays)
export const usTheme: CustomTheme = {
  country: 'US',
  colors: {
    primary: '#01411C', // Green
    primaryDark: '#01260F',
    primaryLight: '#4CAF50',
    secondary: '#AAAAAA', // Gray
    background: '#FFFFFF',
    card: '#FFFFFF',
    cardBackground: '#F7F7F7',
    text: '#212121',
    textSecondary: '#666666',
    border: '#DEDEDE',
    notification: '#4CAF50',
    error: '#F44336',
    success: '#4CAF50',
    warning: '#FFC107',
    info: '#2196F3',
    brand: '#01411C',
    primaryShades: {
      50: "#E6F0EB",
      100: "#C1D9CD",
      200: "#87B89C",
      300: "#4D966A",
      400: "#267D46",
      500: "#01411C",
      600: "#013417",
      700: "#012712",
      800: "#011A0C",
      900: "#000D06",
      950: "#000503"
    },
    grays: {
      50: "#F7F7F7",
      100: "#EDEDED",
      200: "#DEDEDE",
      300: "#CCCCCC",
      400: "#BABABA",
      500: "#AAAAAA",
      600: "#878787",
      700: "#666666",
      800: "#454545",
      900: "#212121",
      950: "#121212"
    }
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    small: 4,
    medium: 8,
    large: 16,
  },
  statusBarStyle: 'dark',
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: 'normal',
    },
    caption: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  navigationTheme: {
    dark: false,
    colors: {
      primary: '#01411C',
      background: '#FFFFFF',
      card: '#FFFFFF',
      text: '#212121',
      border: '#DEDEDE',
      notification: '#4CAF50',
    },
  },
};

// Helper function to generate React Navigation theme from our custom theme
export const getNavigationTheme = (theme: CustomTheme): Theme => {
  // Start with the appropriate built-in theme as a base
  const navigationTheme = DefaultTheme;
  
  // Override colors with our custom ones
  return {
    ...navigationTheme,
    colors: {
      ...navigationTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.card,
      text: theme.colors.text,
      border: theme.colors.border,
      notification: theme.colors.notification,
    },
  };
};

// Helper function to generate React Native Paper theme from our custom theme
export const getPaperTheme = (theme: CustomTheme) => {
  // Start with the appropriate built-in theme as a base
  const paperBaseTheme = MD3LightTheme;
  
  // Override with our custom colors
  return {
    ...paperBaseTheme,
    colors: {
      ...paperBaseTheme.colors,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      error: theme.colors.error,
      background: theme.colors.background,
      surface: theme.colors.card,
      text: theme.colors.text,
      onSurface: theme.colors.text,
      surfaceVariant: theme.colors.grays[50],
    },
  };
}; 