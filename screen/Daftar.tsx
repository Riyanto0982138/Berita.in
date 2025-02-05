import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Definisikan parameter navigasi
type RootStackParamList = {
  Login: undefined;
  Daftar: undefined;
};

const DaftarScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleDaftar = async () => {
    setEmailError("");
    setPasswordError("");

    if (!nama || !email || !password) {
      Alert.alert("Error", "Semua kolom harus diisi!");
      return;
    }

    if (!email.endsWith("@gmail.com") && !email.endsWith("@yahoo.com")) {
      setEmailError("Email harus menggunakan @gmail.com atau @yahoo.com");
      return;
    }

    if (password.length < 8) {
      setPasswordError("Password harus minimal 8 karakter!");
      return;
    }

    const existingUsers = await AsyncStorage.getItem("registeredUsers");
    const users: { nama: string; email: string; password: string }[] = existingUsers ? JSON.parse(existingUsers) : [];

    if (users.some((user: { email: string }) => user.email === email)) {
      setEmailError("Email sudah terdaftar!");
      return;
    }

    const newUser = { nama, email, password };
    users.push(newUser);
    await AsyncStorage.setItem("registeredUsers", JSON.stringify(users));

    Alert.alert("Berhasil", `Selamat Bergabung ${nama}, Silahkan Login`);
    navigation.navigate("Login"); // Kembali ke halaman login
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pendaftaran</Text>

      <TextInput style={styles.input} placeholder="Nama" value={nama} onChangeText={setNama} />
      
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
      
      <TextInput style={styles.input} placeholder="Kata Sandi" secureTextEntry value={password} onChangeText={setPassword} />
      {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleDaftar}>
        <Text style={styles.buttonText}>Daftar</Text>
      </TouchableOpacity>

      {/* Navigasi ke Halaman Login */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Sudah punya akun? Login</Text>
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
    marginBottom: 5,
    backgroundColor: "#fff",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginText: {
    marginTop: 10,
    color: "#007bff",
    textAlign: "center",
    fontSize: 14,
  },
});

export default DaftarScreen;
