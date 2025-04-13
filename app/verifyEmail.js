import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUser } from '../context/UserContext';
import { finalize, handleVerifyOTPRequest } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmailOTPScreen() {
  // State for OTP inputs
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { contextLoginData } = useUser();

  // References for TextInputs to allow auto-focus
  const inputRefs = useRef([]);

  // Navigation
  const router = useRouter();

  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace key press
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Resend OTP function
  const handleResendOtp = () => {
    if (timer === 0) {
      setIsResending(true);

      // Simulate API call to resend OTP
      setTimeout(() => {
        setIsResending(false);
        setTimer(60);
        Alert.alert('Email Sent', 'A new verification code has been sent to your email.');
      }, 1500);
    }
  };

  // Verify OTP function
  const handleVerifyOtp = async () => {
    const otpString = otp.join('');

    if (otpString.length !== 6) {
      Alert.alert('Invalid Code', 'Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifying(true);

    const result = await handleVerifyOTPRequest(contextLoginData.email, otpString);
    if (!result.success) {
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect.', [
        {
          text: 'OK',
          onPress: () => {
            setIsVerifying(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus(); // focus first input again
          },
        },
      ]);
      return;
    }

    const finRes = await finalize(contextLoginData.userid);
    if (!finRes.success) {
      Alert.alert('Invalid Code', 'The verification code you entered is incorrect.', [
        {
          text: 'OK',
          onPress: () => {
            setOtp(['', '', '', '', '', '']);
            setIsVerifying(false);
            inputRefs.current[0]?.focus(); // focus first input again
          },
        },
      ]);
      return;
    }

    const sessionToken = finRes.sessionToken;
    await AsyncStorage.setItem('session_token', sessionToken);
    const userData = {
      userid: contextLoginData.userid,
      email: contextLoginData.email
    };
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    await AsyncStorage.setItem("isLogin", "true");
    console.log("Navigating to dashboard...");
    router.replace("dashboard");
  };

  // Go back function
  const handleGoBack = () => {
    router.back();
  };

  // Function to mask email for privacy
  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;

    const maskedUsername = username.length > 2
      ? `${username.substring(0, 2)}${'*'.repeat(username.length - 2)}`
      : username;

    return `${maskedUsername}@${domain}`;
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Email Verification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.emailIconContainer}>
          <Ionicons name="mail" size={60} color="#2E7D32" />
        </View>

        <Text style={styles.title}>Check Your Email</Text>

        <Text style={styles.description}>
          We've sent a 6-digit verification code to{'\n'}
          <Text style={styles.emailText}>{maskEmail(contextLoginData.email)}</Text>
        </Text>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={1}
              selectTextOnFocus
              autoFocus={index === 0}
            />
          ))}
        </View>

        <View style={styles.infoContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#666" />
          <Text style={styles.infoText}>
            Please check your spam folder if you don't see the email in your inbox
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={timer > 0}
          style={styles.resendContainer}
        >
          {isResending ? (
            <ActivityIndicator size="small" color="#2E7D32" />
          ) : (
            <Text style={[styles.resendText, timer > 0 && styles.resendTextDisabled]}>
              Resend Code {timer > 0 ? `(${timer}s)` : ''}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyOtp}
          disabled={isVerifying}
        >
          <LinearGradient
            colors={['#2E7D32', '#4CAF50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {isVerifying ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.verifyButtonText}>Verify Email</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleGoBack} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Use Different Email</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 20,
    color: '#333',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  emailIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(46, 125, 50, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  emailText: {
    fontWeight: '600',
    color: '#2E7D32',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 30,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    width: '90%',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  resendContainer: {
    alignItems: 'center',
    padding: 10,
    marginTop: 10,
  },
  resendText: {
    color: '#2E7D32',
    fontSize: 16,
    fontWeight: '500',
  },
  resendTextDisabled: {
    color: '#999',
  },
  footer: {
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
  },
  verifyButton: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    alignItems: 'center',
    padding: 16,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '500',
  },
});