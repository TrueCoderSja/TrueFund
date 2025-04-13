import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  ImageBackground, 
  Animated, 
  Dimensions, 
  StatusBar,
  Platform,
  ScrollView
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import * as Haptics from 'expo-haptics';
import { colors, commonStyles } from '../theme/colors';

export default function HomeScreen() {
    const router = useRouter();
    const { width, height } = Dimensions.get('window');
    
    // Animation values
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;
    const scaleAnim = useRef(new Animated.Value(0.9)).current;
    
    // Button animations
    const buttonAnimations = [
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
        useRef(new Animated.Value(0)).current,
    ];
    
    useEffect(() => {
        // Animate main elements
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            })
        ]).start();
        
        // Animate buttons sequentially
        buttonAnimations.forEach((anim, index) => {
            Animated.timing(anim, {
                toValue: 1,
                duration: 400,
                delay: 800 + (index * 100),
                useNativeDriver: true,
            }).start();
        });
    }, []);
    
    // Button press animation
    const animateButtonPress = (index) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        
        Animated.sequence([
            Animated.timing(buttonAnimations[index], {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(buttonAnimations[index], {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            })
        ]).start();
    };
    

    
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#121212" />
            <ImageBackground 
                source={{ uri: 'https://images.unsplash.com/photo-1634128221889-82ed6efebfc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }}
                style={styles.backgroundImage}
                imageStyle={{ opacity: 0.4 }}
            >
                <LinearGradient
                    colors={colors.gradients.dark}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <Animated.View style={[
                            styles.headerContent,
                            {
                                opacity: fadeAnim,
                                transform: [
                                    { translateY: slideAnim },
                                    { scale: scaleAnim }
                                ]
                            }
                        ]}>
                            <View style={styles.headerLeft}>
                                <Text style={styles.greeting}>Welcome back,</Text>
                                <Text style={styles.userName}>Alex</Text>
                            </View>
                            
                            <View style={styles.headerRight}>
                                <TouchableOpacity style={styles.iconButton}>
                                    <Ionicons name="notifications-outline" size={24} color="#fff" />
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.profileButton}
                                    onPress={() => router.push("userProfile")}
                                >
                                    <LinearGradient
                                        colors={colors.gradients.brand}
                                        style={styles.profileGradient}
                                    >
                                        <Text style={styles.profileInitial}>A</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </Animated.View>
                    </View>
                    
                    <ScrollView 
                        style={styles.scrollView}
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Main Features */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Main Features</Text>
                            <View style={styles.buttonGrid}>
                                <Animated.View style={{
                                    opacity: buttonAnimations[0],
                                    transform: [{ scale: buttonAnimations[0] }]
                                }}>
                                    <TouchableOpacity 
                                        style={styles.menuButton}
                                        onPress={() => {
                                            animateButtonPress(0);
                                            setTimeout(() => router.push("dashboard2"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(46, 125, 50, 0.2)'}]}>
                                                <Ionicons name="home" size={28} color="#4CAF50" />
                                            </View>
                                            <Text style={styles.buttonText}>Dashboard</Text>
                                            <Text style={styles.buttonSubtext}>View your financial summary</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                                
                                <Animated.View style={{
                                    opacity: buttonAnimations[1],
                                    transform: [{ scale: buttonAnimations[1] }]
                                }}>
                                    <TouchableOpacity 
                                        style={styles.menuButton}
                                        onPress={() => {
                                            animateButtonPress(1);
                                            setTimeout(() => router.push("lendmoney"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(33, 150, 243, 0.2)'}]}>
                                                <FontAwesome5 name="hand-holding-usd" size={24} color="#2196F3" />
                                            </View>
                                            <Text style={styles.buttonText}>Lend Money</Text>
                                            <Text style={styles.buttonSubtext}>Help others & earn interest</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                                
                                <Animated.View style={{
                                    opacity: buttonAnimations[2],
                                    transform: [{ scale: buttonAnimations[2] }]
                                }}>
                                    <TouchableOpacity 
                                        style={styles.menuButton}
                                        onPress={() => {
                                            animateButtonPress(2);
                                            setTimeout(() => router.push("requestloan"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(156, 39, 176, 0.2)'}]}>
                                                <MaterialCommunityIcons name="cash-plus" size={28} color="#9C27B0" />
                                            </View>
                                            <Text style={styles.buttonText}>Request Loan</Text>
                                            <Text style={styles.buttonSubtext}>Get funds when you need them</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                                
                                <Animated.View style={{
                                    opacity: buttonAnimations[3],
                                    transform: [{ scale: buttonAnimations[3] }]
                                }}>
                                    <TouchableOpacity 
                                        style={styles.menuButton}
                                        onPress={() => {
                                            animateButtonPress(3);
                                            setTimeout(() => router.push("repayment"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(255, 152, 0, 0.2)'}]}>
                                                <MaterialCommunityIcons name="cash-refund" size={28} color="#FF9800" />
                                            </View>
                                            <Text style={styles.buttonText}>Repayment</Text>
                                            <Text style={styles.buttonSubtext}>Manage your loan repayments</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                        
                        {/* Security & Support */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Security & Support</Text>
                            <View style={styles.buttonGrid}>
                                <Animated.View style={{
                                    opacity: buttonAnimations[4],
                                    transform: [{ scale: buttonAnimations[4] }]
                                }}>
                                    <TouchableOpacity 
                                        style={[styles.menuButton, styles.halfButton]}
                                        onPress={() => {
                                            animateButtonPress(4);
                                            setTimeout(() => router.push("fraudReport"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(244, 67, 54, 0.2)'}]}>
                                                <Ionicons name="warning" size={28} color="#F44336" />
                                            </View>
                                            <Text style={styles.buttonText}>Report Fraud</Text>
                                            <Text style={styles.buttonSubtext}>Report suspicious activity</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                                
                                <Animated.View style={{
                                    opacity: buttonAnimations[5],
                                    transform: [{ scale: buttonAnimations[5] }]
                                }}>
                                    <TouchableOpacity 
                                        style={[styles.menuButton, styles.halfButton]}
                                        onPress={() => {
                                            animateButtonPress(5);
                                            setTimeout(() => router.push("otpDemo"), 200);
                                        }}
                                        activeOpacity={0.8}
                                    >
                                        <LinearGradient
                                            colors={['#1E1E1E', '#2A2A2A']}
                                            style={styles.buttonGradient}
                                        >
                                            <View style={[styles.iconCircle, {backgroundColor: 'rgba(76, 175, 80, 0.2)'}]}>
                                                <MaterialCommunityIcons name="shield-check" size={28} color="#4CAF50" />
                                            </View>
                                            <Text style={styles.buttonText}>Verification</Text>
                                            <Text style={styles.buttonSubtext}>Secure your account</Text>
                                            <View style={styles.arrowContainer}>
                                                <Feather name="chevron-right" size={18} color="#666" />
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </Animated.View>
                            </View>
                        </View>
                    </ScrollView>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.primary,
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
    },
    gradient: {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
        paddingBottom: 30,
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: 16,
        color: colors.text.secondary,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginTop: 5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    profileButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
    },
    profileGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        color: colors.text.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary,
        marginBottom: 15,
        paddingLeft: 5,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    menuButton: {
        width: '100%',
        height: 100,
        marginBottom: 15,
        borderRadius: 15,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    halfButton: {
        width: Dimensions.get('window').width / 2 - 27.5,
    },
    buttonGradient: {
        flex: 1,
        padding: 15,
        position: 'relative',
    },
    iconCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: colors.text.primary,
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonSubtext: {
        color: colors.text.secondary,
        fontSize: 12,
        marginTop: 4,
    },
    arrowContainer: {
        position: 'absolute',
        bottom: 15,
        right: 15,
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.ui.overlay,
        justifyContent: 'center',
        alignItems: 'center',
    },

});