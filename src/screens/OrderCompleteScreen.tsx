import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useTheme } from '../theme/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/common/Button';
import { RootStackNavigationProp, RootStackParamList } from '../types/navigation.types';

type OrderCompleteParams = {
  orderId: string;
};

const OrderCompleteScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<RootStackNavigationProp>();
  const route = useRoute<RouteProp<RootStackParamList, 'OrderComplete'>>();
  const { orderId } = route.params || { orderId: 'ORD-123456' };
  
  const handleContinueShopping = () => {
    navigation.navigate('Main');
  };
  
  const handleViewOrder = () => {
    navigation.navigate('OrderDetails', { orderId });
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <StatusBar style={theme.statusBarStyle} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={[styles.closeButton, { backgroundColor: theme.colors.card }]}
          onPress={() => navigation.navigate('Main')}
        >
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.successIcon, { backgroundColor: `${theme.colors.success}20` }]}>
          <Ionicons name="checkmark-circle" size={80} color={theme.colors.success} />
        </View>
        
        <Text style={[styles.title, { color: theme.colors.text }]}>Order Confirmed!</Text>
        
        <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
          Your order has been confirmed and will be shipped soon.
        </Text>
        
        <View style={[styles.orderIdContainer, { backgroundColor: theme.colors.card }]}>
          <Text style={[styles.orderIdLabel, { color: theme.colors.textSecondary }]}>
            Order Number
          </Text>
          <Text style={[styles.orderId, { color: theme.colors.text }]}>
            {orderId}
          </Text>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="mail-outline" size={24} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                Email Confirmation
              </Text>
              <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                A confirmation email has been sent to your email address.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={24} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                Estimated Delivery
              </Text>
              <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                You will receive your order within 3-5 business days.
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={24} color={theme.colors.primary} />
            <View style={styles.infoTextContainer}>
              <Text style={[styles.infoTitle, { color: theme.colors.text }]}>
                Contact Support
              </Text>
              <Text style={[styles.infoDesc, { color: theme.colors.textSecondary }]}>
                If you have any questions, please call us at +1 123-456-7890.
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="View Order Details"
          onPress={handleViewOrder}
          variant="outline"
          style={styles.viewOrderButton}
          textStyle={{ color: theme.colors.primary }}
        />
        <Button
          title="Continue Shopping"
          onPress={handleContinueShopping}
          style={styles.continueButton}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  orderIdContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  orderIdLabel: {
    fontSize: 14,
    marginBottom: 5,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoContainer: {
    width: '100%',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  infoDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
  },
  viewOrderButton: {
    marginBottom: 10,
  },
  continueButton: {
    marginBottom: 10,
  },
});

export default OrderCompleteScreen; 