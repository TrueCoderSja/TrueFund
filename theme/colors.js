// Dark theme color palette for TruFund app

export const colors = {
  // Primary background colors
  background: {
    primary: '#121212',     // Main background
    secondary: '#1A1A1A',   // Card backgrounds
    tertiary: '#222222',    // Modal backgrounds
    elevated: '#2A2A2A',    // Elevated components
  },
  
  // Text colors
  text: {
    primary: '#FFFFFF',     // Primary text
    secondary: '#AAAAAA',   // Secondary text
    tertiary: '#777777',    // Hint text
    disabled: '#555555',    // Disabled text
  },
  
  // Brand colors
  brand: {
    primary: '#2E7D32',     // Primary brand color (green)
    secondary: '#43A047',   // Secondary brand color (lighter green)
    accent: '#66BB6A',      // Accent color
  },
  
  // UI element colors
  ui: {
    border: '#333333',      // Border color
    divider: '#333333',     // Divider color
    card: '#1E1E1E',        // Card color
    input: '#2A2A2A',       // Input background
    inputBorder: '#444444', // Input border
  },
  
  // Status colors
  status: {
    success: '#43A047',     // Success
    error: '#D32F2F',       // Error
    warning: '#F57C00',     // Warning
    info: '#1976D2',        // Info
  },
  
  // Navigation colors
  navigation: {
    background: '#0A0A0A',  // Navigation background (darker)
    active: '#2E7D32',      // Active tab
    inactive: '#777777',    // Inactive tab
  },
  
  // Gradients
  gradients: {
    primary: ['#1A1A1A', '#2A2A2A'],
    brand: ['#2E7D32', '#43A047'],
    dark: ['rgba(0,0,0,0.9)', 'rgba(18,18,18,0.95)', 'rgba(18,18,18,1)'],
    disabled: ['#9E9E9E', '#757575'],
    card: ['#1E1E1E', '#2A2A2A']
  }
};

// Common styles that can be reused across the app
export const commonStyles = {
  // Shadow for cards and elevated elements
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Common border radius
  borderRadius: {
    small: 4,
    medium: 8,
    large: 12,
    extraLarge: 20,
  },
  
  // Common spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
};