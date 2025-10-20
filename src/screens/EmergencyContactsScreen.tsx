import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useAppTheme } from "../hooks/useAppTheme";
import { RootStackParamList } from "../types/navigation";
import { useEmergencyContacts } from "../hooks/useEmergencyContacts";
import { EmergencyContact } from "../store/contactStore";

type Props = NativeStackScreenProps<RootStackParamList, "EmergencyContacts">;

const EmergencyContactsScreen: React.FC<Props> = ({ navigation }) => {
  const {
    t,
    contacts,
    name,
    setName,
    phoneNumber,
    setPhoneNumber,
    isFetching,
    isLoading,
    editingContactId,
    handleSelectContactForEdit,
    handleCancelEdit,
    handleAddOrUpdateContact,
    confirmRemove,
  } = useEmergencyContacts();

  const { colors } = useAppTheme();

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
      <View style={styles.itemActions}>
        <TouchableOpacity
          onPress={() => handleSelectContactForEdit(item)}
          accessibilityLabel={`Edit ${item.name}`}
          accessibilityRole="button"
        >
          <Ionicons name="pencil-outline" size={24} color={colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => confirmRemove(item._id)}
          accessibilityLabel={`${t("dialogs.delete")} ${item.name}`}
          accessibilityRole="button"
          style={{ marginLeft: 16 }}
        >
          <Ionicons name="trash-outline" size={24} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityLabel={t("general.back")}
          accessibilityHint={t("general.accessibility.backHint")}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.headerText }]}>
          {t("settings.emergencyContacts")}
        </Text>
      </View>

      <View
        style={[styles.formContainer, { borderBottomColor: colors.border }]}
      >
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
          editable={!isLoading}
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
          editable={!isLoading}
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: isLoading ? colors.grey : colors.primary },
          ]}
          onPress={handleAddOrUpdateContact}
          accessibilityLabel={
            editingContactId
              ? t("contacts.updateButton")
              : t("contacts.addContact")
          }
          accessibilityRole="button"
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.addButtonText}>
              {editingContactId
                ? t("contacts.updateButton")
                : t("contacts.addContact")}
            </Text>
          )}
        </TouchableOpacity>
        {editingContactId && (
          <TouchableOpacity
            onPress={handleCancelEdit}
            style={styles.cancelButton}
          >
            <Text style={[styles.cancelButtonText, { color: colors.grey }]}>
              {t("contacts.cancelEdit")}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isFetching ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={contacts}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          initialNumToRender={10}
          windowSize={5}
          ListEmptyComponent={
            <Text
              style={{ textAlign: "center", color: colors.grey, marginTop: 20 }}
            >
              {t("call.noEmergencyContacts")}
            </Text>
          }
        />
      )}
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
  listContainer: { paddingHorizontal: 20 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  itemName: { fontSize: 18, fontWeight: "600" },
  itemPhone: { fontSize: 14, marginTop: 4 },
  itemActions: {
    flexDirection: "row",
  },
  cancelButton: {
    marginTop: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
});

export default EmergencyContactsScreen;
