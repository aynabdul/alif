import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '../stores/cartStore';
import Button from '../components/common/Button';
import TextField from '../components/common/TextField';

const CheckoutScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'card',
  });
  
  // Form validation
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
  });
  
  const updateFormField = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    
    // Clear error when typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: '',
      });
    }
  };
  
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };
    
    // Validate fullName
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
      isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    
    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }
    
    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    // Validate city
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
      isValid = false;
    }
    
    // Validate zipCode
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmitOrder = () => {
    if (validateForm()) {
      setIsLoading(true);
      
      // Simulate API call for processing order
      setTimeout(() => {
        setIsLoading(false);
        clearCart();
        navigation.navigate('OrderComplete', {
          orderId: 'ORD-' + Math.floor(100000 + Math.random() * 900000)
        });
      }, 2000);
    } else {
      Alert.alert(
        "Form Validation Error",
        "Please fill in all required fields correctly."
      );
    }
  };
  
  // Calculate subtotal
  const subtotal = getTotalPrice();
  
  // Calculate shipping fee
  const shippingFee = 10;
  
  // Calculate tax
  const taxRate = 0.08; // 8%
  const tax = subtotal * taxRate;
  
  // Calculate total
  const total = subtotal + shippingFee + tax;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Processing your order...</Text>
        </View>
      )}
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.colors.text }]}>Checkout</Text>
        <View style={styles.backButton} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Shipping Information</Text>
          
          <TextField
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => updateFormField('fullName', text)}
            error={errors.fullName}
            placeholder="Enter your full name"
            containerStyle={styles.inputContainer}
          />
          
          <TextField
            label="Email"
            value={formData.email}
            onChangeText={(text) => updateFormField('email', text)}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            containerStyle={styles.inputContainer}
          />
          
          <TextField
            label="Phone"
            value={formData.phone}
            onChangeText={(text) => updateFormField('phone', text)}
            error={errors.phone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            containerStyle={styles.inputContainer}
          />
          
          <TextField
            label="Address"
            value={formData.address}
            onChangeText={(text) => updateFormField('address', text)}
            error={errors.address}
            placeholder="Enter your address"
            containerStyle={styles.inputContainer}
          />
          
          <View style={styles.rowInputs}>
            <View style={styles.halfInput}>
              <TextField
                label="City"
                value={formData.city}
                onChangeText={(text) => updateFormField('city', text)}
                error={errors.city}
                placeholder="City"
                containerStyle={styles.inputContainer}
              />
            </View>
            <View style={styles.halfInput}>
              <TextField
                label="ZIP Code"
                value={formData.zipCode}
                onChangeText={(text) => updateFormField('zipCode', text)}
                error={errors.zipCode}
                placeholder="ZIP Code"
                containerStyle={styles.inputContainer}
              />
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Payment Method</Text>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              { borderColor: theme.colors.border },
              formData.paymentMethod === 'card' && 
                { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}10` }
            ]}
            onPress={() => updateFormField('paymentMethod', 'card')}
          >
            <View style={styles.paymentOptionRadio}>
              {formData.paymentMethod === 'card' && (
                <View style={[styles.paymentOptionRadioInner, { backgroundColor: theme.colors.primary }]} />
              )}
            </View>
            <Ionicons name="card-outline" size={22} color={theme.colors.primary} style={styles.paymentOptionIcon} />
            <Text style={[styles.paymentOptionText, { color: theme.colors.text }]}>Credit/Debit Card</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              { borderColor: theme.colors.border },
              formData.paymentMethod === 'paypal' && 
                { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}10` }
            ]}
            onPress={() => updateFormField('paymentMethod', 'paypal')}
          >
            <View style={styles.paymentOptionRadio}>
              {formData.paymentMethod === 'paypal' && (
                <View style={[styles.paymentOptionRadioInner, { backgroundColor: theme.colors.primary }]} />
              )}
            </View>
            <Ionicons name="logo-paypal" size={22} color="#0070BA" style={styles.paymentOptionIcon} />
            <Text style={[styles.paymentOptionText, { color: theme.colors.text }]}>PayPal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.paymentOption, 
              { borderColor: theme.colors.border },
              formData.paymentMethod === 'bank' && 
                { borderColor: theme.colors.primary, backgroundColor: `${theme.colors.primary}10` }
            ]}
            onPress={() => updateFormField('paymentMethod', 'bank')}
          >
            <View style={styles.paymentOptionRadio}>
              {formData.paymentMethod === 'bank' && (
                <View style={[styles.paymentOptionRadioInner, { backgroundColor: theme.colors.primary }]} />
              )}
            </View>
            <Ionicons name="wallet-outline" size={22} color={theme.colors.primary} style={styles.paymentOptionIcon} />
            <Text style={[styles.paymentOptionText, { color: theme.colors.text }]}>Bank Transfer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Subtotal</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Shipping</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>${shippingFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={[styles.summaryLabel, { color: theme.colors.textSecondary }]}>Tax (8%)</Text>
            <Text style={[styles.summaryValue, { color: theme.colors.text }]}>${tax.toFixed(2)}</Text>
          </View>
          
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          
          <View style={styles.summaryRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>Total</Text>
            <Text style={[styles.totalValue, { color: theme.colors.primary }]}>${total.toFixed(2)}</Text>
          </View>
        </View>
        
        <Button
          title="Place Order"
          onPress={handleSubmitOrder}
          containerStyle={styles.placeOrderButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  paymentOptionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paymentOptionRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paymentOptionIcon: {
    marginLeft: 15,
  },
  paymentOptionText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  placeOrderButton: {
    marginBottom: 30,
  },
});

export default CheckoutScreen; 