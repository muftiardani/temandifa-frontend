import { useState, useEffect } from "react";
import { Alert, LayoutAnimation, UIManager, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import Toast from "react-native-toast-message";
import { useContactStore, EmergencyContact } from "../store/contactStore";
import { useAppStore } from "../store/appStore";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const useEmergencyContacts = () => {
  const { t } = useTranslation();
  const { contacts, fetchContacts, addContact, removeContact, updateContact } =
    useContactStore();

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [editingContactId, setEditingContactId] = useState<string | null>(null);

  const isLoading = useAppStore((state) => state.isLoading);
  const setIsLoading = useAppStore((state) => state.setIsLoading);

  useEffect(() => {
    const loadContacts = async () => {
      setIsFetching(true);
      try {
        await fetchContacts();
      } catch (error) {
        console.error("Gagal memuat kontak awal:", error);
        Toast.show({
          type: "error",
          text1: t("dialogs.failed"),
          text2: t("general.genericError"),
        });
      } finally {
        setIsFetching(false);
      }
    };
    loadContacts();
  }, [fetchContacts, t]);

  const handleSelectContactForEdit = (contact: EmergencyContact) => {
    setEditingContactId(contact._id);
    setName(contact.name);
    setPhoneNumber(contact.phoneNumber);
  };

  const handleCancelEdit = () => {
    setEditingContactId(null);
    setName("");
    setPhoneNumber("");
  };

  const handleAddOrUpdateContact = async () => {
    if (!name.trim() || !phoneNumber.trim()) {
      Toast.show({
        type: "error",
        text1: t("dialogs.failed"),
        text2: t("auth.allFieldsRequired"),
      });
      return;
    }

    setIsLoading(true);
    try {
      if (editingContactId) {
        await updateContact(editingContactId, { name, phoneNumber });
        Toast.show({
          type: "success",
          text1: t("general.success"),
          text2: t("contacts.updateSuccess"),
        });
      } else {
        await addContact({ name, phoneNumber });
        Toast.show({
          type: "success",
          text1: t("general.success"),
          text2: t("contacts.addSuccess"),
        });
      }
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      handleCancelEdit();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.message === "networkError"
          ? t("general.networkError")
          : error instanceof Error && error.message
          ? error.message
          : t("general.genericError");
      Toast.show({
        type: "error",
        text1: t("dialogs.failed"),
        text2: errorMessage,
      });
      console.error("Gagal menambah/memperbarui kontak:", error);
    } finally {
      setIsLoading(false);
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
          onPress: async () => {
            setIsLoading(true);
            try {
              await removeContact(id);
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut
              );
              Toast.show({
                type: "success",
                text1: t("general.success"),
                text2: t("contacts.deleteSuccess"),
              });
            } catch (error: unknown) {
              const errorMessage =
                error instanceof Error && error.message === "networkError"
                  ? t("general.networkError")
                  : error instanceof Error && error.message
                  ? error.message
                  : t("contacts.deleteFailed");
              Toast.show({
                type: "error",
                text1: t("dialogs.failed"),
                text2: errorMessage,
              });
              console.error("Gagal menghapus kontak:", error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return {
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
  };
};
