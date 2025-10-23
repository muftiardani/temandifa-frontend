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
import ScreenHeader from "../components/common/ScreenHeader";

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
      <ScreenHeader title={t("settings.emergencyContacts")} />
      <View style={styles.contentContainer}>
        <View
          style={[styles.formContainer, { borderBottomColor: colors.border }]}
        >
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
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
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.card,
              },
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
                ? t("contacts.updateButton") +
                  t("general.accessibility.buttonSuffix")
                : t("contacts.addContact") +
                  t("general.accessibility.buttonSuffix")
            }
            accessibilityRole="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                style={[styles.addButtonText, { color: colors.buttonText }]}
              >
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
              accessibilityLabel={
                t("contacts.cancelEdit") +
                t("general.accessibility.buttonSuffix")
              }
              accessibilityRole="button"
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
                style={{
                  textAlign: "center",
                  color: colors.grey,
                  marginTop: 20,
                }}
              >
                {t("call.noEmergencyContacts")}
              </Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },
  formContainer: { padding: 20, borderBottomWidth: 1 },
  input: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 12,
  },
  addButton: { padding: 15, borderRadius: 8, alignItems: "center" },
  addButtonText: { fontSize: 16, fontWeight: "bold" },
  listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
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
