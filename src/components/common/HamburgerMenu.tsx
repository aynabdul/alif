// src/components/HamburgerMenu.tsx
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../../types/navigation.types';
import { useTheme } from '../../theme/ThemeContext';
import { Category } from '../../types/api.types';

interface HamburgerMenuProps {
  categories: Category[];
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ categories }) => {
  const { theme, country } = useTheme(); // Destructure country from useTheme
  const navigation = useNavigation<RootStackNavigationProp>();
  const [isOpen, setIsOpen] = useState(false);
  const [showShopDropdown, setShowShopDropdown] = useState(false);
  const [showQurbaniDropdown, setShowQurbaniDropdown] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Close dropdowns when closing the menu
    if (isOpen) {
      setShowShopDropdown(false);
      setShowQurbaniDropdown(false);
    }
  };
    // Determine logo based on country
    const logoSource = country === 'US'
    ? require('../../../assets/logoAmerica.png')
    : require('../../../assets/Logo.png');

  const handleCategoryPress = (categoryId: string, categoryName: string) => {
    setIsOpen(false);
    navigation.navigate('CategoryProducts', { categoryId, categoryName });
  };

  const handleAllProductsPress = () => {
    setIsOpen(false);
    navigation.navigate('AllProducts');
  };

  const handleQurbaniBookPress = () => {
    setIsOpen(false);
    navigation.navigate('QurbaniBooking');
  };

  const handleQurbaniDonatePress = () => {
    setIsOpen(false);
    navigation.navigate('QurbaniDonate');
  };

  const handleContactPress = () => {
    setIsOpen(false);
    navigation.navigate('Contact');
  };

  const handleAboutPress = () => {
    setIsOpen(false);
    navigation.navigate('About');
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
        <Ionicons name="menu" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={toggleMenu}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
              <View 
                style={[
                  styles.menuContainer, 
                  { backgroundColor: theme.colors.card }
                ]}
              >
                <View style={styles.header}>
                  <Image
                    source={logoSource} // Use dynamic logo
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <TouchableOpacity onPress={toggleMenu} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={theme.colors.text} />
                  </TouchableOpacity>
                </View>

                <ScrollView style={styles.menuItems}>
                  {/* Shop Option with Dropdown */}
                  <View>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => setShowShopDropdown(!showShopDropdown)}
                    >
                      <View style={styles.menuItemRow}>
                        <Ionicons name="cart-outline" size={20} color={theme.colors.text} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                          Shop
                        </Text>
                        <Ionicons 
                          name={showShopDropdown ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={theme.colors.text} 
                        />
                      </View>
                    </TouchableOpacity>

                    {showShopDropdown && (
                      <View style={styles.dropdown}>
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={handleAllProductsPress}
                        >
                          <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                            All Products
                          </Text>
                        </TouchableOpacity>
                        
                        {categories.map(category => (
                          <TouchableOpacity 
                            key={category.id}
                            style={styles.dropdownItem}
                            onPress={() => handleCategoryPress(category.id.toString(), category.categoryName)}
                          >
                            <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                              {category.categoryName}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  {/* Qurbani Option with Dropdown */}
                  <View>
                    <TouchableOpacity 
                      style={styles.menuItem}
                      onPress={() => setShowQurbaniDropdown(!showQurbaniDropdown)}
                    >
                      <View style={styles.menuItemRow}>
                        <Ionicons name="gift-outline" size={20} color={theme.colors.text} />
                        <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                          Qurbani
                        </Text>
                        <Ionicons 
                          name={showQurbaniDropdown ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={theme.colors.text} 
                        />
                      </View>
                    </TouchableOpacity>

                    {showQurbaniDropdown && (
                      <View style={styles.dropdown}>
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={handleQurbaniBookPress}
                        >
                          <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                            Book Your Qurbani
                          </Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          style={styles.dropdownItem}
                          onPress={handleQurbaniDonatePress}
                        >
                          <Text style={[styles.dropdownItemText, { color: theme.colors.text }]}>
                            Donate Qurbani
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  {/* About Us */}
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={handleAboutPress}
                  >
                    <View style={styles.menuItemRow}>
                      <Ionicons name="information-circle-outline" size={20} color={theme.colors.text} />
                      <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                        About Us
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Contact Us */}
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={handleContactPress}
                  >
                    <View style={styles.menuItemRow}>
                      <Ionicons name="call-outline" size={20} color={theme.colors.text} />
                      <Text style={[styles.menuItemText, { color: theme.colors.text }]}>
                        Contact Us
                      </Text>
                    </View>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  menuButton: {
    padding: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  menuContainer: {
    width: 280,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  logo: {
    width: 100, // Adjusted size to fit header
    height: 40,  // Adjusted size to fit header
  },
  closeButton: {
    padding: 5,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  menuItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    flex: 1,
  },
  dropdown: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)',
    paddingLeft: 20,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.03)',
  },
  dropdownItemText: {
    fontSize: 14,
  },
});

export default HamburgerMenu;