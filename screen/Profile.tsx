import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Animated
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Profile {
  id: string;
  nama: string;
  nim: string;
  jurusan: string;
  foto: any;
}

const data: Profile[] = [
  { id: "1", nama: "Ajisurya Ariyana", nim: "17221032", jurusan: "Teknik Informatika", foto: require("../Images/Card/Aji.jpg") },
  { id: "2", nama: "Muhamad Fazri Muchlisin", nim: "17221037", jurusan: "Teknik Informatika", foto: require("../Images/Card/Fazri.jpg") },
  { id: "3", nama: "Yudi Ismail", nim: "17223019", jurusan: "Teknik Informatika", foto: require("../Images/Card/Iduy.jpg") },
  { id: "4", nama: "Nuriawan Dwi Utama", nim: "17224005", jurusan: "Teknik Informatika", foto: require("../Images/Card/Nuriawan.jpg") },
  { id: "5", nama: "Riyanto", nim: "17221015", jurusan: "Teknik Informatika", foto: require("../Images/Card/Riyan.jpg") },
];

const ProfileScreen = ({ setIsLoggedIn }: { setIsLoggedIn: (value: boolean) => void }) => {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [showProfiles, setShowProfiles] = useState(false); // State untuk menampilkan daftar profil

  // Animasi logo berkedip
  const fadeAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    const fadeInOut = Animated.loop(
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    fadeInOut.start();
  }, []);
  
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isLoggedIn");
      Alert.alert("Logout Berhasil", "Anda telah keluar dari akun.", [
        { text: "OK", onPress: () => setIsLoggedIn(false) },
      ]);
    } catch (error) {
      console.error("Error saat logout:", error);
    }
  };

  const openModal = (profile: Profile) => {
    setSelectedProfile(profile);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProfile(null);
  };

  const renderItem = ({ item }: { item: Profile }) => (
    <TouchableOpacity style={styles.card} onPress={() => openModal(item)}>
      <Image source={item.foto} style={styles.image} />
      <Text style={styles.name}>{item.nama}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Logo Berkedip */}
      <Animated.Image
        source={require("../Images/Logo/Logo.png")}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
      {/* Tombol About Me */}
      <TouchableOpacity style={styles.aboutMeButton} onPress={() => setShowProfiles(!showProfiles)}>
        <Text style={styles.aboutTitle}>About Me</Text>
        <Text style={styles.arrow}>{showProfiles ? "↓" : "→"}</Text>
      </TouchableOpacity>

      {/* Jika showProfiles true, tampilkan daftar */}
      {showProfiles && (
        <FlatList 
          data={data} 
          renderItem={renderItem} 
          keyExtractor={(item) => item.id} 
        />
      )}

      {/* Tombol Logout di luar daftar profil */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      {/* Modal Detail Profile */}
      {selectedProfile && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image source={selectedProfile.foto} style={styles.modalImage} />
              <Text style={styles.modalText}>Nama: {selectedProfile.nama}</Text>
              <Text style={styles.modalText}>NIM: {selectedProfile.nim}</Text>
              <Text style={styles.modalText}>Jurusan: {selectedProfile.jurusan}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },

  aboutMeButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 10,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  arrow: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#808080",
    borderRadius: 10,
    padding: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  logoutButton: {
    backgroundColor: "#ff4d4d",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
