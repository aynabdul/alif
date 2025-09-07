import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  StyleProp, 
  ViewStyle, 
  TextStyle 
} from 'react-native';
import { useTheme } from '../../theme/ThemeContext';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  footer?: React.ReactNode;
  elevation?: number;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  style,
  titleStyle,
  onPress,
  footer,
  elevation = 2,
  bordered = true,
}) => {
  const { theme } = useTheme();

  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.card,
          borderColor: bordered ? theme.colors.border : 'transparent',
          shadowOpacity: elevation > 0 ? 0.1 : 0,
          elevation: elevation,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {title && (
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title, 
            { color: theme.colors.text }, 
            titleStyle
          ]}>
            {title}
          </Text>
        </View>
      )}

      <View style={styles.content}>{children}</View>

      {footer && <View style={styles.footer}>{footer}</View>}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  titleContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  footer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});

export default Card; 