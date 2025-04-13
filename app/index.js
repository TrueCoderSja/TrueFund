import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Button, View, Text } from "react-native";
import { InteractionManager } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from "../context/UserContext";

export default function InitialScreen() {
    const router = useRouter();
    const { setContextLoginData, setSessionToken }=useUser();

    async function initLogin() {
        const isLogin=await AsyncStorage.getItem("isLogin");
        console.log(isLogin);
        if(isLogin=="true") {
            console.log("Detected previous login");
            const contextLoginData=await AsyncStorage.getItem("userData");
            const sessionToken=await AsyncStorage.getItem("session_token");

            console.log(contextLoginData);
            console.log(sessionToken);

            if(!contextLoginData || !sessionToken) {
                await AsyncStorage.clear();
                console.log("Routing to signin options");
                router.replace("authenticationToken");
            }
            setContextLoginData(JSON.stringify({
                userid: contextLoginData.userid,
                email: contextLoginData.email
            }));

            
            setSessionToken(sessionToken);
            console.log("Navigating to dashboard");
            router.replace("home");
        } else {
            router.replace("authenticationOptions");
        }
    }

    return (
        <View>
            <Text>Loading...</Text>
            <Button
                title="Authenticate"
                onPress={() => {
                    initLogin();
                }}
            />
        </View>
    );
}
