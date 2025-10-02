import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeButton from "../HomeButton";

jest.mock("../../hooks/useAppTheme", () => {
  const { lightColors } = require("../../../constants/Colors");
  const { strings } = require("../../../constants/Strings");
  return {
    useAppTheme: () => ({
      colors: lightColors,
      t: strings.id,
    }),
  };
});

describe("HomeButton", () => {
  it("renders correctly with given props", () => {
    const mockOnPress = jest.fn();
    const { getByText, getByTestId } = render(
      <HomeButton
        icon="camera"
        title="Kamera"
        onPress={mockOnPress}
        backgroundColor="#007AFF"
        testID="home-button-camera"
      />
    );

    expect(getByText("Kamera")).toBeTruthy();
    expect(getByTestId("home-button-camera-icon")).toBeTruthy();
  });

  it("calls onPress function when pressed", () => {
    const mockOnPress = jest.fn();
    const { getByTestId } = render(
      <HomeButton
        icon="camera"
        title="Kamera"
        onPress={mockOnPress}
        backgroundColor="#007AFF"
        testID="home-button-camera"
      />
    );

    fireEvent.press(getByTestId("home-button-camera"));

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
