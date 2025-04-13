import React, { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Switch, 
  Alert, 
  Animated, 
  ScrollView, 
  SafeAreaView, 
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { colors, commonStyles } from '../theme/colors';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export default function RequestLoanScreen() {
  const router = useRouter();
  const { width, height } = Dimensions.get('window');
  
  // State variables
  const [loanAmount, setLoanAmount] = useState('');
  const [repaymentDuration, setRepaymentDuration] = useState('7 days');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formElements = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  
  // Loan details
  const interestRate = 0.05; // Example interest rate
  const creditRating = "Good"; // Example credit rating
  const maxLoanAmount = 10000; // Maximum loan amount
  
  // Animation for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  
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
    
    // Animate form elements sequentially
    formElements.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: 300 + (index * 150),
        useNativeDriver: true,
      }).start();
    });
    
    // Animate progress based on form completion
    updateProgress();
  }, [loanAmount, repaymentDuration, loanPurpose, agreeToTerms]);
  
  // Calculate progress percentage based on form completion
  const updateProgress = () => {
    let progress = 0;
    
    if (loanAmount) progress += 30;
    if (repaymentDuration) progress += 20;
    if (loanPurpose) progress += 20;
    if (agreeToTerms) progress += 30;
    
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const calculateTotalRepayable = () => {
    const amount = parseFloat(loanAmount) || 0;
    return amount + amount * interestRate;
  };
  
  // Calculate monthly payment
  const calculateMonthlyPayment = () => {
    const amount = parseFloat(loanAmount) || 0;
    const totalRepayable = amount + amount * interestRate;
    
    let months = 0;
    if (repaymentDuration === '7 days') {
      return totalRepayable; // One-time payment
    } else if (repaymentDuration === '14 days') {
      return totalRepayable; // One-time payment
    } else if (repaymentDuration === '1 month') {
      return totalRepayable; // One-time payment
    } else if (repaymentDuration === '3 months') {
      months = 3;
    } else if (repaymentDuration === '6 months') {
      months = 6;
    }
    
    return months > 0 ? totalRepayable / months : totalRepayable;
  };
  
  // Format currency
  const formatCurrency = (amount) => {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  const handleSubmitRequest = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Invalid Amount", "Please enter a valid loan amount.");
      return;
    }
    
    if (parseFloat(loanAmount) > maxLoanAmount) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Amount Exceeds Limit", `The maximum loan amount is $${maxLoanAmount}.`);
      return;
    }
    
    if (!agreeToTerms) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert("Terms Required", "Please agree to the terms and conditions before submitting.");
      return;
    }
    
    // Animate button and show loading
    animateButton();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert(
        "Loan Request Submitted!", 
        `Your loan request for ${formatCurrency(loanAmount)} has been successfully submitted.`,
        [
          {
            text: "OK",
            onPress: () => {
              // Navigate to dashboard or another screen after submission
              router.push("dashboard2");
            }
          }
        ]
      );
    }, 1500);
  };

  const animateButton = () => {
    // Provide haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.navigation.background} />
      
      <LinearGradient
        colors={colors.gradients.brand}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.backButtonHeader}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        
        <Animated.Text 
          style={[
            styles.headerTitle,
            {
              opacity: fadeAnim,
              transform: [{ translateX: slideAnim }]
            }
          ]}
        >
          Request a Loan
        </Animated.Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.helpButton}>
            <Ionicons name="help-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Complete your application</Text>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill,
              { width: progressWidth }
            ]}
          />
        </View>
      </View>
      
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formElements[0],
                transform: [
                  { translateY: slideAnim },
                  { scale: formElements[0].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="cash" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Loan Amount</Text>
            </View>
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={colors.text.tertiary}
                keyboardType="numeric"
                value={loanAmount}
                onChangeText={setLoanAmount}
                maxLength={7}
                selectionColor={colors.brand.accent}
                color={colors.text.primary}
              />
            </View>
            
            <Text style={styles.maxAmountText}>
              Maximum amount: ${maxLoanAmount.toLocaleString()}
            </Text>
            
            <View style={styles.sliderContainer}>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabel}>$100</Text>
                <Text style={styles.sliderLabel}>${maxLoanAmount.toLocaleString()}</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formElements[1],
                transform: [
                  { translateY: slideAnim },
                  { scale: formElements[1].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Repayment Duration</Text>
            </View>
            
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={repaymentDuration}
                style={styles.picker}
                onValueChange={(itemValue) => setRepaymentDuration(itemValue)}
                dropdownIconColor={colors.brand.primary}
              >
                <Picker.Item label="7 days" value="7 days" />
                <Picker.Item label="14 days" value="14 days" />
                <Picker.Item label="1 month" value="1 month" />
                <Picker.Item label="3 months" value="3 months" />
                <Picker.Item label="6 months" value="6 months" />
              </Picker>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formSection,
              {
                opacity: formElements[2],
                transform: [
                  { translateY: slideAnim },
                  { scale: formElements[2].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1]
                    })
                  }
                ]
              }
            ]}
          >
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="text-box-outline" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Purpose of Loan</Text>
            </View>
            
            <TextInput
              style={styles.purposeInput}
              placeholder="Briefly describe why you need this loan..."
              placeholderTextColor={colors.text.tertiary}
              value={loanPurpose}
              onChangeText={setLoanPurpose}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              selectionColor={colors.brand.accent}
              color={colors.text.primary}
            />
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.summaryCard,
              {
                opacity: formElements[3],
                transform: [
                  { translateY: slideAnim },
                  { scale: formElements[3].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.95, 1]
                    })
                  }
                ]
              }
            ]}
          >
            <LinearGradient
              colors={colors.gradients.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.summaryGradient}
            >
              <View style={styles.summaryHeader}>
                <Text style={styles.summaryTitle}>Loan Summary</Text>
                <FontAwesome5 name="file-invoice-dollar" size={24} color={colors.text.primary} />
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Loan Amount:</Text>
                <Text style={styles.summaryValue}>
                  {loanAmount ? formatCurrency(loanAmount) : '$0.00'}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Interest Rate:</Text>
                <Text style={styles.summaryValue}>{(interestRate * 100).toFixed(1)}%</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Repayable:</Text>
                <Text style={styles.summaryValue}>
                  {formatCurrency(calculateTotalRepayable())}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Repayment Term:</Text>
                <Text style={styles.summaryValue}>{repaymentDuration}</Text>
              </View>
              
              {(repaymentDuration === '3 months' || repaymentDuration === '6 months') && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Monthly Payment:</Text>
                  <Text style={styles.summaryValue}>
                    {formatCurrency(calculateMonthlyPayment())}
                  </Text>
                </View>
              )}
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Due Date:</Text>
                <Text style={styles.summaryValue}>
                  {repaymentDuration === '7 days' 
                    ? '7 days from approval' 
                    : repaymentDuration === '14 days' 
                      ? '14 days from approval' 
                      : repaymentDuration === '1 month'
                        ? '1 month from approval'
                        : repaymentDuration === '3 months'
                          ? '3 monthly payments'
                          : '6 monthly payments'
                  }
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.creditRatingContainer,
              {
                opacity: formElements[3],
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.creditRatingHeader}>
              <MaterialCommunityIcons name="shield-check" size={20} color={colors.brand.primary} />
              <Text style={styles.creditRatingTitle}>Your Credit Profile</Text>
            </View>
            <View style={styles.creditRatingContent}>
              <View style={styles.creditRatingItem}>
                <Text style={styles.creditRatingLabel}>Credit Rating:</Text>
                <Text style={[styles.creditRatingValue, styles.goodRating]}>{creditRating}</Text>
              </View>
              <View style={styles.creditRatingItem}>
                <Text style={styles.creditRatingLabel}>Approval Chance:</Text>
                <Text style={[styles.creditRatingValue, styles.goodRating]}>High</Text>
              </View>
            </View>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.termsSection,
              {
                opacity: formElements[4],
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.termsContainer}>
              <Switch
                value={agreeToTerms}
                onValueChange={(value) => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setAgreeToTerms(value);
                }}
                trackColor={{ false: colors.ui.border, true: colors.brand.primary }}
                thumbColor={agreeToTerms ? colors.text.primary : colors.background.elevated}
                ios_backgroundColor={colors.ui.border}
              />
              <View style={styles.termsTextContainer}>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms and Conditions</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View 
            style={[
              { transform: [{ scale: buttonScale }] },
              {
                opacity: formElements[4],
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <TouchableOpacity
              style={[styles.submitButton, !agreeToTerms && styles.submitButtonDisabled]}
              onPress={() => {
                if (!isSubmitting && agreeToTerms) {
                  animateButton();
                  handleSubmitRequest();
                } else if (!agreeToTerms) {
                  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                }
              }}
              disabled={isSubmitting || !agreeToTerms}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={agreeToTerms ? colors.gradients.brand : colors.gradients.disabled}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.submitGradient}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <Animated.View 
                      style={{ 
                        transform: [{ 
                          rotate: fadeAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: ['0deg', '360deg'],
                          })
                        }] 
                      }}
                    >
                      <Ionicons name="refresh" size={24} color="#fff" />
                    </Animated.View>
                    <Text style={styles.submitButtonText}>Processing...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <MaterialCommunityIcons name="send" size={20} color="#fff" style={styles.submitIcon} />
                    <Text style={styles.submitButtonText}>Submit Loan Request</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.back();
            }}
          >
            <Text style={styles.backButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButtonHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  helpButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.background.secondary,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  progressText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: colors.background.elevated,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.brand.primary,
    borderRadius: 3,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
    backgroundColor: colors.background.primary,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background.primary,
  },
  formSection: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 10,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 10,
    backgroundColor: colors.background.elevated,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  currencySymbol: {
    fontSize: 24,
    color: colors.brand.primary,
    fontWeight: 'bold',
  },
  amountInput: {
    flex: 1,
    fontSize: 24,
    padding: 15,
    color: colors.text.primary,
  },
  maxAmountText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 15,
  },
  sliderContainer: {
    marginTop: 5,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabel: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 10,
    backgroundColor: colors.background.elevated,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.text.primary,
  },
  purposeInput: {
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 10,
    backgroundColor: colors.background.elevated,
    padding: 15,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    color: colors.text.primary,
  },
  summaryCard: {
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  summaryGradient: {
    padding: 20,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    paddingBottom: 10,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
  creditRatingContainer: {
    backgroundColor: colors.background.secondary,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  creditRatingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  creditRatingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginLeft: 8,
  },
  creditRatingContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  creditRatingItem: {
    alignItems: 'center',
  },
  creditRatingLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 5,
  },
  creditRatingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  goodRating: {
    color: colors.brand.primary,
  },
  termsSection: {
    marginBottom: 25,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.secondary,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    borderWidth: 1,
    borderColor: colors.ui.border,
    shadowRadius: 4,
    elevation: 2,
  },
  termsTextContainer: {
    flex: 1,
    marginLeft: 10,
  },
  termsText: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.brand.primary,
    fontWeight: '600',
  },
  submitButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: colors.brand.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    ...commonStyles.cardShadow,
  },
  submitButtonDisabled: {
    opacity: 0.8,
  },
  submitGradient: {
    paddingVertical: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitIcon: {
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  backButton: {
    alignItems: 'center',
    padding: 15,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});
