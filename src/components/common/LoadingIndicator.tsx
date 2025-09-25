import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";
import { Colors } from "../../constants/Colors";

interface Props {
  text?: string;
}

const LoadingIndicator: React.FC<Props> = ({ text }) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={Colors.primary} />
    {text && <Text style={styles.text}>{text}</Text>}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: Colors.grey,
  },
});

export default LoadingIndicator;
