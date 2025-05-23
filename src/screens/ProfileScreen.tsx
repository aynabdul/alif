// src/screens/ProfileScreen.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image,
  SafeAreaView,
  Linking
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../types/navigation.types';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../stores/authStore';

const ProfileScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const { user, isAuthenticated, signOut } = useAuthStore();

  // Get the first two letters of the user's name (if available)
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : 'UN';

  const menuItems = [
    ...(isAuthenticated ? [
      {
        id: 'orders',
        title: 'My Orders',
        icon: 'receipt-outline',
        screen: 'OrderHistory',
      }
    ] : []),
    {
      id: 'country',
      title: 'Change Country',
      icon: 'globe-outline',
      screen: 'CountrySelect',
    },
    {
      id: 'faqs',
      title: 'FAQs',
      icon: 'help-circle-outline',
      screen: 'FAQs',
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'shield-outline',
      screen: 'PrivacyPolicy',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: 'document-text-outline',
      screen: 'Terms',
    }
  ];

  const handleLogout = () => {
    signOut();
  };

  const handleInstagramPress = () => {
    Linking.openURL('https://www.instagram.com/devsphereteam?igsh=aG11NnhzM2wxM2E4');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Profile</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {isAuthenticated ? (
          <View style={[styles.profileCard, { backgroundColor: theme.colors.card }]}>
            <View style={styles.profileHeader}>
              <View style={styles.initialsContainer}>
                <Text style={styles.initialsText}>{userInitials}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: theme.colors.text }]}>
                  {user?.name || 'User Name'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.colors.textSecondary }]}>
                  {user?.email || 'user@example.com'}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <View style={[styles.authCard, { backgroundColor: theme.colors.card }]}>
            <Text style={[styles.authTitle, { color: theme.colors.text }]}>
              Sign in to your account
            </Text>
            <Text style={[styles.authSubtitle, { color: theme.colors.textSecondary }]}>
              Access your orders and account settings
            </Text>
            <View style={styles.authButtonsContainer}>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: theme.colors.brand }]}
                onPress={() => {
                  navigation.navigate('Auth', { screen: 'Login' });
                }}
              >
                <Text style={[styles.authButtonText, { textAlign: 'center' }]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.authButton, { backgroundColor: theme.colors.primary, marginTop: 10 }]}
                onPress={() => {
                  navigation.navigate('Auth', { screen: 'Register' });
                }}
              >
                <Text style={[styles.authButtonText, { textAlign: 'center' }]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        <View style={styles.menuContainer}>
          {menuItems.map(item => (
            <TouchableOpacity 
              key={item.id}
              style={[styles.menuItem, { borderBottomColor: theme.colors.border }]}
              onPress={() => navigation.navigate(item.screen as never)}
            >
              <View style={styles.menuLeft}>
                <Ionicons name={item.icon as any} size={22} color={theme.colors.primary} />
                <Text style={[styles.menuTitle, { color: theme.colors.text }]}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
        
        {isAuthenticated && (
          <TouchableOpacity 
          style={[styles.authButton, { backgroundColor: theme.colors.primary, marginBottom: 20 }]} // Use same style as authButton
            onPress={handleLogout}
          >
            <View style={styles.logoutButtonContent }>
              <Ionicons name="log-out-outline" size={20} color="white" />
              <Text style={[styles.authButtonText, { textAlign: 'center', marginLeft: 8 }]}>Logout</Text>
            </View>
          </TouchableOpacity>
        )}
        
        <View style={styles.footer}>
          <Text style={[styles.copyrightText, { color: theme.colors.textSecondary }]}>
            Alif Cattle & Goat Farm © 2025. All Rights Reserved
          </Text>
          <TouchableOpacity 
            style={styles.developerLink}
            onPress={handleInstagramPress}
          >
            <Text style={[styles.developerText, { color: theme.colors.textSecondary }]}>
              Developed by Team DevSphere
            </Text>
            <Ionicons name="logo-instagram" size={16} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  header: {
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  profileCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initialsContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e0e0e0', // Light gray background for the initials circle
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initialsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // Dark color for initials
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
  },
  authCard: {
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  authTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  authSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  authButtonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  authButton: {
    width: '100%',
    paddingVertical: 13,
    paddingHorizontal: 10,
    borderRadius: 8,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  authButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  menuContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuTitle: {
    marginLeft: 15,
    fontSize: 16,
  },
  logoutButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  copyrightText: {
    fontSize: 12,
    marginBottom: 8,
  },
  developerLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  developerText: {
    fontSize: 12,
    marginRight: 6,
  },
});

export default ProfileScreen;