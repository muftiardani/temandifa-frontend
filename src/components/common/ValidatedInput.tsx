import React, { useState, ReactNode } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  AccessibilityProps,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useAppTheme } from "../../hooks/useAppTheme";

interface ValidatedInputProps extends TextInputProps, AccessibilityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  rightIcon?: ReactNode;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  icon,
  error,
  secureTextEntry,
  rightIcon,
  ...props
}) => {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const hasError = Boolean(error);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  return (
    <View style={styles.wrapper}>
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: hasError ? colors.danger : colors.border,
            backgroundColor: colors.card,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={22}
            color={colors.grey}
            style={styles.inputIcon}
          />
        )}
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.grey}
          secureTextEntry={isSecure}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsSecure(!isSecure)}
            style={styles.eyeIcon}
            accessibilityLabel={
              isSecure
                ? t("validatedInput.showPassword")
                : t("validatedInput.hidePassword")
            }
            accessibilityRole="button"
          >
            <Ionicons
              name={isSecure ? "eye-off-outline" : "eye-outline"}
              size={24}
              color={colors.grey}
            />
          </TouchableOpacity>
        )}
        {rightIcon}
      </View>
      {hasError ? (
        <Text
          style={[styles.errorText, { color: colors.error }]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  eyeIcon: {
    padding: 10,
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 15,
    marginTop: 4,
    fontSize: 12,
  },
});

export default ValidatedInput;
