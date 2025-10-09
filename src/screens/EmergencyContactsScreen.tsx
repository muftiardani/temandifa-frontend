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
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../hooks/useAppTheme";
import { useContactStore, EmergencyContact } from "../store/contactStore";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = NativeStackScreenProps<RootStackParamList, "EmergencyContacts">;

const EmergencyContactsScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const { colors } = useAppTheme();
  const { contacts, addContact, removeContact } = useContactStore();
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleAddContact = () => {
    if (name.trim() && phoneNumber.trim()) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      addContact({ name, phoneNumber });
      setName("");
      setPhoneNumber("");
    } else {
      Alert.alert(t("dialogs.failed"), t("auth.allFieldsRequired"));
    }
  };

  const confirmRemove = (id: string) => {
    Alert.alert(
      t("dialogs.deleteContactTitle"),
      t("dialogs.deleteContactMessage"),
      [
        { text: t("dialogs.cancel"), style: "cancel" },
        {
          text: t("dialogs.delete"),
          style: "destructive",
          onPress: () => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            removeContact(id);
          },
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
      <TouchableOpacity
        onPress={() => confirmRemove(item.id)}
        accessibilityLabel={`${t("dialogs.delete")} ${item.name}`}
        accessibilityRole="button"
      >
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
          accessibilityLabel={t("general.back")}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t("settings.emergencyContacts")}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder={t("contacts.contactName")}
          value={name}
          onChangeText={setName}
          placeholderTextColor={colors.grey}
          accessibilityLabel={t("contacts.contactName")}
        />
        <TextInput
          style={[
            styles.input,
            { color: colors.text, borderColor: colors.border },
          ]}
          placeholder={t("contacts.phoneNumber")}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholderTextColor={colors.grey}
          accessibilityLabel={t("contacts.phoneNumber")}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddContact}
          accessibilityLabel={t("contacts.addContact")}
          accessibilityRole="button"
        >
          <Text style={styles.addButtonText}>{t("contacts.addContact")}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", color: colors.grey }}>
            {t("call.noEmergencyContacts")}
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
