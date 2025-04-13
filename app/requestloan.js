import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../theme/colors';
import { useAuthFetch } from "../hooks/useAuthFetch";

export default function RequestLoanScreen() {
  const router = useRouter();

  // State variables
  const [loanAmount, setLoanAmount] = useState('');
  const [repaymentDate, setRepaymentDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // Default: 30 days from now
  const [incentiveAmount, setIncentiveAmount] = useState('50'); // Default incentive amount
  const [loanPurpose, setLoanPurpose] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [useCustomTerms, setUseCustomTerms] = useState(false);

  const authFetch = useAuthFetch();

  const handlePostProductRequest = async () => {
    const result = await authFetch("http://10.3.2.8:3000/api/makeRequest", {
      method: "POST",
      body: JSON.stringify({
        amount: loanAmount,
        incentive: incentiveAmount,
        description: loanPurpose,
        end_date: repaymentDate
      })
    });

    console.log(result);
    if (!result.success) {
      return;
    }

    router.replace("/home");
  }

  // Calculate total repayment amount
  const calculateTotalRepayment = () => {
    const principal = parseFloat(loanAmount) || 0;
    const incentive = parseFloat(incentiveAmount) || 0;
    return principal + incentive;
  };

  const handleBackPress = () => {
    router.back();
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || repaymentDate;
    setShowDatePicker(Platform.OS === 'ios');
    setRepaymentDate(currentDate);
  };

  const handleSubmit = () => {
    // Validate inputs
    if (!loanAmount || parseFloat(loanAmount) <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid loan amount.");
      return;
    }

    if (!loanPurpose.trim()) {
      Alert.alert("Missing Information", "Please enter the purpose of the loan.");
      return;
    }

    if (!agreeToTerms) {
      Alert.alert("Terms Required", "Please agree to the terms and conditions before submitting.");
      return;
    }

    // Regular submission
    setIsSubmitting(true);

    // Simulate API call
    handlePostProductRequest();
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Calculate days until repayment
  const daysUntilRepayment = Math.ceil((repaymentDate - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request a Loan</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Loan Amount */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="cash" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Loan Amount</Text>
            </View>

            <View style={styles.inputWithIcon}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                value={loanAmount}
                onChangeText={setLoanAmount}
                keyboardType="numeric"
                placeholder="Enter loan amount"
              />
            </View>
          </View>

          {/* Custom Terms Toggle */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="cog" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Loan Terms</Text>
            </View>

            <View style={styles.toggleContainer}>
              <View style={styles.toggleTextContainer}>
                <Text style={styles.toggleTitle}>Use Custom Terms</Text>
                <Text style={styles.toggleDescription}>
                  Set detailed custom terms for your loan request
                </Text>
              </View>
              <Switch
                value={useCustomTerms}
                onValueChange={setUseCustomTerms}
                trackColor={{ false: '#767577', true: colors.brand.primary }}
                thumbColor="#f4f3f4"
              />
            </View>

            {useCustomTerms ? (
              <Text style={styles.customTermsNote}>
                You'll be able to set detailed terms after submitting the basic loan information.
              </Text>
            ) : (
              <>
                {/* Basic Terms (shown when custom terms are disabled) */}
                <View style={styles.basicTermsContainer}>
                  {/* Repayment Date */}
                  <View style={styles.termSection}>
                    <Text style={styles.termLabel}>Repayment Date:</Text>
                    <TouchableOpacity
                      style={styles.datePickerButton}
                      onPress={() => setShowDatePicker(true)}
                    >
                      <Text style={styles.datePickerButtonText}>
                        {repaymentDate.toLocaleDateString()}
                      </Text>
                      <Ionicons name="calendar" size={20} color={colors.text.secondary} />
                    </TouchableOpacity>

                    {showDatePicker && (
                      <DateTimePicker
                        value={repaymentDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                        minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)} // Minimum 1 day from now
                      />
                    )}

                    <Text style={styles.helperText}>
                      {daysUntilRepayment} days from today
                    </Text>
                  </View>

                  {/* Incentive Amount */}
                  <View style={styles.termSection}>
                    <Text style={styles.termLabel}>Incentive Amount:</Text>
                    <View style={styles.inputWithIcon}>
                      <Text style={styles.currencySymbol}>$</Text>
                      <TextInput
                        style={styles.amountInput}
                        value={incentiveAmount}
                        onChangeText={setIncentiveAmount}
                        keyboardType="numeric"
                        placeholder="Enter incentive amount"
                      />
                    </View>

                    <Text style={styles.helperText}>
                      This is an extra amount you'll pay to the lender as an incentive.
                    </Text>
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Loan Purpose */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="text-box-outline" size={24} color={colors.brand.primary} />
              <Text style={styles.sectionTitle}>Loan Purpose</Text>
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
            />
          </View>

          {/* Summary Card (only shown when not using custom terms) */}
          {!useCustomTerms && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Repayment Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Loan Amount:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(loanAmount)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Incentive Amount:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(incentiveAmount)}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total Repayment:</Text>
                <Text style={styles.summaryValue}>{formatCurrency(calculateTotalRepayment())}</Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Repayment Date:</Text>
                <Text style={styles.summaryValue}>{repaymentDate.toLocaleDateString()}</Text>
              </View>
            </View>
          )}

          {/* Terms Agreement */}
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.termsCheckbox}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the terms and conditions of this loan request
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!agreeToTerms || isSubmitting) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!agreeToTerms || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {useCustomTerms ? "Continue to Custom Terms" : "Submit Loan Request"}
              </Text>
            )}
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
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: colors.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text.primary,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  section: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginLeft: 8,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 8,
    backgroundColor: colors.background.primary,
  },
  currencySymbol: {
    fontSize: 18,
    color: colors.text.secondary,
    paddingHorizontal: 12,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 18,
    color: colors.text.primary,
    paddingRight: 12,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  toggleDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  customTermsNote: {
    fontSize: 14,
    color: colors.text.secondary,
    fontStyle: 'italic',
    marginTop: 12,
    padding: 12,
    backgroundColor: colors.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.ui.border,
  },
  basicTermsContainer: {
    marginTop: 16,
  },
  termSection: {
    marginBottom: 16,
  },
  termLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text.primary,
    marginBottom: 8,
  },
  datePickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.background.primary,
  },
  datePickerButtonText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  helperText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 8,
    marginLeft: 4,
  },
  purposeInput: {
    height: 100,
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: colors.background.elevated,
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.ui.borderLight,
  },
  summaryLabel: {
    fontSize: 16,
    color: colors.text.primary,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.secondary,
  },
  termsContainer: {
    marginBottom: 24,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.brand.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.primary,
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  submitButton: {
    backgroundColor: colors.brand.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: colors.ui.disabled,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});