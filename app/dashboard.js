import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Animated, 
  Dimensions, 
  ImageBackground,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, commonStyles } from '../theme/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [userName, setUserName] = useState('Alex');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const cardAnimations = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  
  // Animated header values
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 100],
    extrapolate: 'clamp',
  });
  
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, 60, 90],
    outputRange: [0, 0.7, 1],
    extrapolate: 'clamp',
  });
  
  // Check if user is logged in
  useEffect(() => {
    // This would typically check for a token or user session
    // For demo purposes, we'll just redirect to login if needed
    const checkAuth = async () => {
      // In a real app, check for authentication token
      // If not authenticated, redirect to login
      // For now, we'll just leave this as a placeholder
    };
    
    checkAuth();
  }, []);
  
  useEffect(() => {
    // Animate main elements
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animate cards sequentially
    cardAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + (index * 150),
        useNativeDriver: true,
      }).start();
    });
  }, []);

  const handleLogout = () => {
    console.log("User logged out");
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("login");
  };
  
  // Current date for greeting
  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navigation.background} />
      
      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <LinearGradient
          colors={['#0A0A0A', '#121212', '#1A1A1A']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <Animated.View style={[styles.headerContent, { opacity: headerOpacity }]}>
            <Text style={styles.greeting}>{getCurrentGreeting()},</Text>
            <Text style={styles.userName}>{userName}!</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </Animated.View>
          
          <Animated.Text style={[styles.headerTitle, { opacity: headerTitleOpacity }]}>
            TruFund Dashboard
          </Animated.Text>
        </LinearGradient>
      </Animated.View>
      
      <Animated.ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Active Loans */}
        <Animated.View style={[
          styles.card,
          {
            opacity: cardAnimations[0],
            transform: [
              { translateY: slideAnim },
              { scale: cardAnimations[0].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Loans</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.loanCard}>
            <View style={styles.loanCardHeader}>
              <View style={styles.loanUserContainer}>
                <View style={styles.loanUserAvatar}>
                  <Text style={styles.loanUserInitial}>J</Text>
                </View>
                <Text style={styles.loanUserName}>John Doe</Text>
              </View>
              <View style={[styles.loanStatusBadge, styles.loanStatusActive]}>
                <Text style={styles.loanStatusText}>Active</Text>
              </View>
            </View>
            
            <View style={styles.loanDetails}>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Amount</Text>
                <Text style={styles.loanDetailValue}>$500</Text>
              </View>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Due Date</Text>
                <Text style={styles.loanDetailValue}>12/12/2023</Text>
              </View>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Interest</Text>
                <Text style={styles.loanDetailValue}>5%</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.loanCard}>
            <View style={styles.loanCardHeader}>
              <View style={styles.loanUserContainer}>
                <View style={[styles.loanUserAvatar, {backgroundColor: '#7B1FA2'}]}>
                  <Text style={styles.loanUserInitial}>J</Text>
                </View>
                <Text style={styles.loanUserName}>Jane Smith</Text>
              </View>
              <View style={[styles.loanStatusBadge, styles.loanStatusPending]}>
                <Text style={styles.loanStatusText}>Pending</Text>
              </View>
            </View>
            
            <View style={styles.loanDetails}>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Amount</Text>
                <Text style={styles.loanDetailValue}>$300</Text>
              </View>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Due Date</Text>
                <Text style={styles.loanDetailValue}>01/01/2024</Text>
              </View>
              <View style={styles.loanDetail}>
                <Text style={styles.loanDetailLabel}>Interest</Text>
                <Text style={styles.loanDetailValue}>5%</Text>
              </View>
            </View>
          </View>
        </Animated.View>
        
        {/* Recent Activity */}
        <Animated.View style={[
          styles.card,
          {
            opacity: cardAnimations[1],
            transform: [
              { translateY: slideAnim },
              { scale: cardAnimations[1].interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.9, 1]
                })
              }
            ]
          }
        ]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, {backgroundColor: '#43A047'}]}>
              <Ionicons name="arrow-forward" size={18} color="#fff" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Loan to John Doe</Text>
              <Text style={styles.activityDate}>Oct 15, 2023</Text>
            </View>
            <Text style={styles.activityAmount}>-$500</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, {backgroundColor: '#1976D2'}]}>
              <Ionicons name="arrow-back" size={18} color="#fff" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Repayment from Jane Smith</Text>
              <Text style={styles.activityDate}>Oct 10, 2023</Text>
            </View>
            <Text style={[styles.activityAmount, styles.activityAmountPositive]}>+$100</Text>
          </View>
          
          <View style={styles.activityItem}>
            <View style={[styles.activityIcon, {backgroundColor: '#FB8C00'}]}>
              <Ionicons name="cash-outline" size={18} color="#fff" />
            </View>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>Interest Earned</Text>
              <Text style={styles.activityDate}>Oct 5, 2023</Text>
            </View>
            <Text style={[styles.activityAmount, styles.activityAmountPositive]}>+$25</Text>
          </View>
        </Animated.View>
      </Animated.ScrollView>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("home")}>
          <Ionicons name="home" size={24} color="#2E7D32" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={() => router.push("main")}>
          <Ionicons name="person-outline" size={24} color="#757575" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.navItem} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
          <Text style={[styles.navText, {color: '#d32f2f'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    width: '100%',
    overflow: 'hidden',
    zIndex: 10,
  },
  headerGradient: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  headerContent: {
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    alignSelf: 'center',
    marginBottom: 10,
  },
  headerIcons: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    right: 0,
  },
  iconButton: {
    padding: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 90, // Space for bottom nav
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  seeAllText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },

  loanCard: {
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  loanUserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loanUserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#2E7D32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  loanUserInitial: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loanUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loanStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  loanStatusActive: {
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
  },
  loanStatusPending: {
    backgroundColor: 'rgba(251, 140, 0, 0.1)',
  },
  loanStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2E7D32',
  },
  loanDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loanDetail: {
    alignItems: 'center',
  },
  loanDetailLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 5,
  },
  loanDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 3,
  },
  activityDate: {
    fontSize: 12,
    color: '#757575',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityAmountPositive: {
    color: '#43A047',
  },
  bottomNav: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.navigation.background,
    height: 70,
    borderTopWidth: 1,
    borderTopColor: colors.ui.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  navText: {
    fontSize: 12,
    color: colors.navigation.inactive,
    marginTop: 4,
  },
  navTextActive: {
    color: colors.navigation.active,
    fontWeight: '600',
  },
});
