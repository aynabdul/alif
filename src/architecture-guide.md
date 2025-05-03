# Alif Animal Farm App Architecture Guide

## Project Overview
Alif Animal Farm is a React Native mobile application built using Expo, designed to serve customers in both the US and Pakistan markets. The app provides a platform for browsing and purchasing livestock, managing Qurbani services, and handling user-specific features based on geographical location.

## Technology Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **State Management**: Zustand
- **UI Components**: React Native Paper
- **API Client**: Axios
- **Build/Preview**: Expo Go (Development), EAS Build (Production)

## Project Structure
```
AlifAnimalFarm/
├── app.json                 # Expo configuration
├── App.tsx                  # Root component
├── babel.config.js         # Babel configuration
├── eas.json               # EAS Build configuration
├── index.ts               # Entry point
├── metro.config.js        # Metro bundler configuration
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
│
├── assets/                # Static assets
│   ├── adaptive-icon.png  # Android adaptive icon
│   ├── default-avatar.png # Default user avatar
│   ├── default-product.png# Default product image
│   ├── favicon.png        # Web favicon
│   ├── icon.png          # App icon
│   ├── Logo.png          # Pakistan market logo
│   ├── logoAmerica.png   # US market logo
│   └── splash-icon.png   # Splash screen icon
│
└── src/
    ├── components/        # Reusable UI components
    │   ├── common/       # Shared components (Button, Input, etc.)
    │   │   ├── Button.tsx
    │   │   ├── CircularLoader.tsx
    │   │   └── Input.tsx
    │   ├── home/        # Home screen specific components
    │   ├── product/     # Product related components
    │   ├── qurbani/     # Qurbani specific components
    │   ├── cart/        # Shopping cart components
    │   └── profile/     # User profile components
    │
    ├── config/          # Configuration files
    │   └── api.ts       # API configuration
    │
    ├── constants/       # App constants
    │   └── index.ts     # Centralized constants
    │
    ├── hooks/          # Custom React hooks
    │   └── useOfflineSync.ts
    │
    ├── navigation/     # Navigation configuration
    │   ├── AppNavigator.tsx    # Main app navigation
    │   ├── AuthNavigator.tsx   # Authentication flow
    │   ├── navigationUtils.ts  # Navigation utilities
    │   ├── RootNavigator.tsx   # Root navigation handler
    │   └── TabNavigator.tsx    # Bottom tab navigation
    │
    ├── screens/        # Application screens
    │   ├── AboutScreen.tsx
    │   ├── AllProductsScreen.tsx
    │   ├── CartScreen.tsx
    │   ├── CategoryProductsScreen.tsx
    │   ├── CheckoutScreen.tsx
    │   ├── CountrySelectScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── ProductDetailsScreen.tsx
    │   ├── ProfileScreen.tsx
    │   └── QurbaniScreen.tsx
    │
    ├── services/       # API services
    │   ├── api.service.ts
    │   ├── auth.service.ts
    │   └── storage.service.ts
    │
    ├── stores/         # State management
    │   ├── authStore.ts
    │   ├── cartStore.ts
    │   └── themeStore.ts
    │
    ├── theme/          # Theming system
    │   ├── ThemeContext.tsx
    │   ├── themes.ts
    │   └── typography.ts
    │
    ├── types/         # TypeScript type definitions
    │   ├── api.types.ts
    │   └── navigation.types.ts
    │
    └── utils/         # Utility functions
        ├── storage.ts
        └── validation.ts
```

## Theme System
The app implements a dynamic theming system based on geographical location:

- **US Theme**:
  - Primary colors focused on blue and gold
  - English language
  - USD currency
  - US-specific product catalog

- **Pakistan Theme**:
  - Primary colors focused on green and white
  - Urdu language support
  - PKR currency
  - Pakistan-specific product catalog

Theme switching is handled by the ThemeContext and persisted in local storage.

## Navigation Flow
```
RootNavigator
├── CountrySelect (Initial Launch)
├── AuthNavigator
│   ├── Welcome
│   ├── Login
│   ├── Register
│   └── ForgotPassword
└── AppNavigator (Protected)
    ├── TabNavigator
    │   ├── Home
    │   ├── Products
    │   ├── Qurbani
    │   ├── Cart
    │   └── Profile
    └── Screens
        ├── ProductDetails
        ├── CategoryProducts
        ├── QurbaniDetails
        ├── Checkout
        ├── OrderComplete
        └── Search
```

## Expo Development Workflow
1. Development:
   - Use `expo start` to launch development server
   - Preview on Android using Expo Go app
   - Live reload and hot module replacement enabled

2. Testing:
   - Run on physical devices via Expo Go
   - Use Android Emulator/iOS Simulator
   - Implement unit tests with Jest

3. Building:
   - Configure in `eas.json` for different profiles
   - Use `eas build` for generating native builds
   - Handle app signing and certificates through EAS

## Data Flow
1. **API Layer**:
   - Centralized API configuration in `config/api.ts`
   - Service functions for each feature domain
   - Automatic token handling and refresh
   - Offline support with request queueing

2. **State Management**:
   - Zustand stores for global state
   - Persistent storage for critical data
   - Optimistic UI updates
   - Offline-first approach

3. **Theme Management**:
   - Context-based theme provider
   - Country-specific theme configurations
   - Dynamic style generation
   - Persistent theme preferences

## Best Practices
1. **Code Organization**:
   - Feature-based component structure
   - Shared components in common/
   - Type-safe props and state
   - Clear separation of concerns

2. **Performance**:
   - Lazy loading of screens
   - Optimized image loading
   - Minimal re-renders
   - Efficient list rendering

3. **Error Handling**:
   - Global error boundary
   - Graceful offline handling
   - User-friendly error messages
   - Automated error reporting

4. **Testing**:
   - Component unit tests
   - Integration testing
   - E2E testing with Detox
   - Continuous Integration

## Security Considerations
1. Secure storage for sensitive data
2. API token management
3. Input validation
4. Secure communication
5. Data encryption

## Deployment Process
1. Version management
2. Environment configuration
3. Build generation
4. Testing verification
5. Store submission
