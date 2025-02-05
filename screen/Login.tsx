import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definisikan parameter navigasi
type RootStackParamList = {
  Login: undefined;
  Daftar: undefined;
};

interface LoginScreenProps {
  setIsLoggedIn: (value: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ setIsLoggedIn }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registeredUsers, setRegisteredUsers] = useState<{ email: string; password: string }[]>([]);

  useEffect(() => {
    const loadRegisteredUsers = async () => {
      const data = await AsyncStorage.getItem("registeredUsers");
      if (data) {
        setRegisteredUsers(JSON.parse(data));
      }
    };
    loadRegisteredUsers();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Silakan isi email dan password!");
      return;
    }

    const user = registeredUsers.find(user => user.email === email && user.password === password);

    if (user) {
      Alert.alert("Berhasil", "Login berhasil!");
      await AsyncStorage.setItem("isLoggedIn", "true");
      setIsLoggedIn(true);
    } else {
      Alert.alert("Error", "Email atau password salah!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Kata Sandi" secureTextEntry value={password} onChangeText={setPassword} />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>

      {/* Navigasi ke Halaman Daftar */}
      <TouchableOpacity onPress={() => navigation.navigate("Daftar")}>
        <Text style={styles.registerText}>Belum punya akun? Daftar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerText: {
    marginTop: 10,
    color: "#007bff",
    textAlign: "center",
    fontSize: 14,
  },
});

export default LoginScreen;
