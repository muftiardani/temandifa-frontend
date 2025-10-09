import React from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  AccessibilityProps,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAppTheme } from "../../hooks/useAppTheme";

interface ValidatedInputProps extends TextInputProps, AccessibilityProps {
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  icon,
  error,
  ...props
}) => {
  const { colors } = useAppTheme();
  const hasError = Boolean(error);

  return (
    <>
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
          {...props}
        />
      </View>
      {hasError ? (
        <Text
          style={[styles.errorText, { color: colors.error }]}
          accessibilityLiveRegion="polite"
        >
          {error}
        </Text>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  input: {
    flex: 1,
    padding: 15,
    fontSize: 16,
  },
  inputIcon: {
    marginRight: 10,
  },
  errorText: {
    alignSelf: "flex-start",
    marginLeft: 15,
    marginBottom: 10,
    fontSize: 12,
  },
});

export default ValidatedInput;
