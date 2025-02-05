import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  Image,
  Animated,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

// Import Halaman
import News from "./screen/News";
import Home from "./screen/Home";
import ProfileScreen from "./screen/Profile";
import LoginScreen from "./screen/Login";
import DaftarScreen from "./screen/Daftar";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === "dark";
  const [isSplashVisible, setSplashVisible] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const fadeAnim = new Animated.Value(1);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const status = await AsyncStorage.getItem("isLoggedIn");
      setIsLoggedIn(status === "true");
    };
    checkLoginStatus();

    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 3000, // Durasi splash screen 3 detik
      useNativeDriver: true,
    }).start(() => setSplashVisible(false));
  }, []);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  if (isSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Image source={require("./Images/Logo/Logo.png")} style={styles.logo} />
        </Animated.View>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        {isLoggedIn === null ? null : isLoggedIn ? (
          <MainApp setIsLoggedIn={setIsLoggedIn} />
        ) : (
          <AuthStack setIsLoggedIn={setIsLoggedIn} />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
};

// Navigasi Utama Setelah Login
type MainAppProps = {
  setIsLoggedIn: (value: boolean) => void;
};

const MainApp = ({ setIsLoggedIn }: MainAppProps) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ size }) => {
          let iconSource;
          if (route.name === "Home") {
            iconSource = require("./Images/Icons/Home.png");
          } else if (route.name === "News") {
            iconSource = require("./Images/Icons/News.png");
          } else if (route.name === "Profile") {
            iconSource = require("./Images/Icons/Profile.png");
          }
          return <Image source={iconSource} style={{ width: size, height: size, resizeMode: "contain" }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

// Stack Navigasi Login dan Pendaftaran
type AuthStackProps = {
  setIsLoggedIn: (value: boolean) => void;
};

const AuthStack = ({ setIsLoggedIn }: AuthStackProps) => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
      </Stack.Screen>
      <Stack.Screen name="Daftar" component={DaftarScreen} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default App;
