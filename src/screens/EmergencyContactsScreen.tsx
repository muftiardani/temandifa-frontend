import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { useContactStore, EmergencyContact } from "../store/contactStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "EmergencyContacts">;

const EmergencyContactsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { contacts, addContact, removeContact } = useContactStore();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleAddContact = () => {
    if (name.trim() && phoneNumber.trim()) {
      addContact({ name, phoneNumber });
      setName("");
      setPhoneNumber("");
    } else {
      Alert.alert("Gagal", "Nama dan Nomor Telepon harus diisi.");
    }
  };

  const confirmRemove = (id: string) => {
    Alert.alert(
      "Hapus Kontak",
      "Apakah Anda yakin ingin menghapus kontak ini?",
      [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => removeContact(id),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: EmergencyContact }) => (
    <View style={[styles.itemContainer, { borderBottomColor: colors.border }]}>
      <View>
        <Text style={[styles.itemName, { color: colors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemPhone, { color: colors.grey }]}>
          {item.phoneNumber}
        </Text>
      </View>
      <TouchableOpacity onPress={() => confirmRemove(item.id)}>
        <Ionicons name="trash-outline" size={24} color={colors.danger} />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          Kontak Darurat
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Nama Kontak"
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.grey}
        />
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder="Nomor Telepon"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor={colors.grey}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddContact}
        >
          <Text style={styles.addButtonText}>Tambah Kontak</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: colors.grey }}>
            Belum ada kontak darurat.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: { marginRight: 16, padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: "600" },
  formContainer: { padding: 20, borderBottomWidth: 1 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: { padding: 15, borderRadius: 8, alignItems: "center" },
  addButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  listContainer: { padding: 20 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemName: { fontSize: 18, fontWeight: "600" },
  itemPhone: { fontSize: 14, marginTop: 4 },
});

export default EmergencyContactsScreen;
