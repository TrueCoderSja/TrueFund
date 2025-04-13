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
  ScrollView,
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { handleSignUpRequest } from "../api/auth";
import { useUser } from '../context/UserContext';

// Constants for repeated values
const COLORS = {
  primary: '#2E7D32',
  error: '#ff3b30',
  text: '#333',
  placeholder: '#666',
  background: '#f9f9f9',
};

const MESSAGES = {
  fullNameRequired: 'Full name is required',
  emailRequired: 'Email is required',
  validEmail: 'Please enter a valid email',
  passwordRequired: 'Password is required',
  passwordLength: 'Password must be at least 6 characters',
  confirmPasswordRequired: 'Please confirm your password',
  passwordsMismatch: 'Passwords do not match',
  validPhoneNumber: 'Please enter a valid 10-digit phone number',
};

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePhoneNumber = (phone) => /^\d{10}$/.test(phone);

const InputField = ({ label, value, onChangeText, placeholder, error, secureTextEntry, showToggle, onToggle }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
      <Ionicons name="person-outline" size={20} color={COLORS.placeholder} style={styles.inputIcon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {showToggle && (
        <TouchableOpacity style={styles.passwordToggle} onPress={onToggle}>
          <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.placeholder} />
        </TouchableOpacity>
      )}
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

export default function SignUpScreen() {
  const [userid, setUserId]=useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fullNameError, setFullNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');

  const [aadhar, setAadhar] = useState('');
  const [dob, setDob] = useState('');
  const [address, setAddress] = useState('');

  const [aadharError, setAadharError] = useState('');
  const [dobError, setDobError] = useState('');
  const [addressError, setAddressError] = useState('');

  const router = useRouter();
  const { setContextLoginData }=useUser();

  const validateForm = () => {
    let isValid = true;

    if (!fullName.trim()) {
      setFullNameError(MESSAGES.fullNameRequired);
      isValid = false;
    } else {
      setFullNameError('');
    }

    if (!email.trim()) {
      setEmailError(MESSAGES.emailRequired);
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError(MESSAGES.validEmail);
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password.trim()) {
      setPasswordError(MESSAGES.passwordRequired);
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError(MESSAGES.passwordLength);
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (!confirmPassword.trim()) {
      setConfirmPasswordError(MESSAGES.confirmPasswordRequired);
      isValid = false;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError(MESSAGES.passwordsMismatch);
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }

    if (phoneNumber.trim() && !validatePhoneNumber(phoneNumber)) {
      setPhoneNumberError(MESSAGES.validPhoneNumber);
      isValid = false;
    } else {
      setPhoneNumberError('');
    }

    if (!aadhar.trim()) {
      setAadharError("Aadhar number is required");
      isValid = false;
    } else if (!/^\d{12}$/.test(aadhar)) {
      setAadharError("Enter a valid 12-digit Aadhar number");
      isValid = false;
    } else {
      setAadharError('');
    }

    if (!dob.trim()) {
      setDobError("Date of birth is required");
      isValid = false;
    } else {
      setDobError('');
    }

    if (!address.trim()) {
      setAddressError("Address is required");
      isValid = false;
    } else {
      setAddressError('');
    }

    return isValid;
  };

  const handleSignUp = async () => {
    if (validateForm()) {
      console.log('Sign up attempt with:', { fullName, email, password, phoneNumber });

      const userData={
        id: userid,
        username: fullName,
        email,
        phone: phoneNumber,
        password,
        address,
        dob,
        aadhar
      }

      const result=await handleSignUpRequest(userData);
      console.log(result);
      if(result.success) {
        setContextLoginData({
          userid,
          email
        });
        
        router.replace("/verifyEmail");
        console.log("Replaced")
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TruFund</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>

            <InputField
              label="User ID"
              value={userid}
              onChangeText={setUserId}
              placeholder="Enter new user ID"
              error={fullNameError}
            />

            <InputField
              label="Name"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Enter your full name"
              error={fullNameError}
            />

            <InputField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              error={emailError}
            />

            <InputField
              label="Phone Number (Optional)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="Enter your phone number"
              error={phoneNumberError}
            />

            <InputField
              label="Aadhar Number"
              value={aadhar}
              onChangeText={setAadhar}
              placeholder="Enter 12-digit Aadhar"
              error={aadharError}
            />

            <InputField
              label="Date of Birth"
              value={dob}
              onChangeText={setDob}
              placeholder="DD/MM/YYYY"
              error={dobError}
            />

            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              placeholder="Enter your full address"
              error={addressError}
            />

            <InputField
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              error={passwordError}
              secureTextEntry={!showPassword}
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <InputField
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              error={confirmPasswordError}
              secureTextEntry={!showConfirmPassword}
              showToggle={true}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpButtonText}>Create Account</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.placeholder,
    marginBottom: 25,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    height: 55,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: COLORS.text,
  },
  passwordToggle: {
    padding: 5,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  signUpButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 5,
  },
  loginText: {
    color: COLORS.placeholder,
    fontSize: 14,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  termsText: {
    color: COLORS.placeholder,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});