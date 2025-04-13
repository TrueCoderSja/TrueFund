import React from "react";
import { Text, Button, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";

export default function InitialScreen() {
    const router = useRouter();
    
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Text style={styles.logoText}>TruFund</Text>
                <Text style={styles.tagline}>Your trusted financial partner</Text>
            </View>
            
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => router.navigate("login")}
                >
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => router.navigate("signup")}
                >
                    <Text style={styles.signupButtonText}>Create Account</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    By continuing, you agree to our{' '}
                    <Text style={styles.footerLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.footerLink}>Privacy Policy</Text>
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 80,
    },
    logoText: {
        fontSize: 42,
        fontWeight: 'bold',
        color: '#2E7D32', // Green color for TruFund
        marginBottom: 10,
    },
    tagline: {
        fontSize: 16,
        color: '#666',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 40,
    },
    loginButton: {
        backgroundColor: '#2E7D32',
        borderRadius: 10,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    signupButton: {
        backgroundColor: '#fff',
        borderRadius: 10,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#2E7D32',
    },
    signupButtonText: {
        color: '#2E7D32',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        color: '#666',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
    },
    footerLink: {
        color: '#2E7D32',
        fontWeight: '600',
    },
});