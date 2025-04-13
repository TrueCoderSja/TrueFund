import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors, commonStyles } from '../theme/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { loginUser } from '../api/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  // Basic email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Form validation
  const validateForm = () => {
    let isValid = true;

    // if (!email.trim()) {
    //   setEmailError('Email is required');
    //   isValid = false;
    // } else if (!validateEmail(email)) {
    //   setEmailError('Please enter a valid email');
    //   isValid = false;
    // } else {
    //   setEmailError('');
    // }

    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    if (validateForm()) {
      // Here you would typically call your authentication API
      // For now, we'll just simulate a successful login
      console.log('Login attempt with:', { email, password });

      const result = await loginUser(email, password);
      if (!result.success) {
        Alert.alert('Invalid Code', 'Invalid username or password.', [
          {
            text: 'OK'
          },
        ]);
        return;
      }

      const sessionToken = result.sessionToken;
      console.log(result);
      await AsyncStorage.setItem('session_token', sessionToken);
      await AsyncStorage.setItem('userData', JSON.stringify(result.userData));
      await AsyncStorage.setItem("isLogin", "true");
      console.log("Navigating to dashboard");
      router.replace("/");
    }
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    router.push('/forgot-password');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <StatusBar barStyle="light-content" backgroundColor={colors.navigation.background} />
        <LinearGradient
          colors={colors.gradients.dark}
          style={styles.gradientBackground}
        >
          <View style={styles.logoContainer}>
            {/* Replace with your app logo */}
            <Text style={styles.logoText}>TruFund</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <View style={[styles.inputWrapper, emailError ? styles.inputError : null]}>
                <Ionicons name="mail-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor={colors.text.tertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  selectionColor={colors.brand.accent}
                />
              </View>
              {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={[styles.inputWrapper, passwordError ? styles.inputError : null]}>
                <Ionicons name="lock-closed-outline" size={20} color={colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.text.tertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  selectionColor={colors.brand.accent}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
            </View>

            <TouchableOpacity
              style={styles.forgotPasswordContainer}
              onPress={handleForgotPassword}
            >
              <Text style={styles.forgotPasswordText} onPress={() => { router.replace("forgot password") }}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleLogin}
            >
              <LinearGradient
                colors={colors.gradients.brand}
                style={styles.gradientButton}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  gradientBackground: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.brand.primary,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.ui.border,
    borderRadius: 10,
    backgroundColor: colors.background.elevated,
    paddingHorizontal: 15,
    height: 55,
  },
  inputError: {
    borderColor: colors.status.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: colors.text.primary,
  },
  passwordToggle: {
    padding: 5,
  },
  errorText: {
    color: colors.status.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotPasswordText: {
    color: colors.brand.accent,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 10,
    height: 55,
    overflow: 'hidden',
    marginBottom: 20,
    ...commonStyles.cardShadow,
  },
  gradientButton: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  signupText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  signupLink: {
    color: colors.brand.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});