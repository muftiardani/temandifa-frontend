import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import HomeButton from "../HomeButton";

describe("HomeButton", () => {
  it("renders correctly with title and icon", async () => {
    const { findByText } = render(
      <HomeButton
        title="Test"
        icon="camera"
        onPress={() => {}}
        backgroundColor="#000000"
      />
    );
    expect(await findByText("Test")).toBeTruthy();
  });

  it("calls onPress when pressed", () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <HomeButton
        title="Press Me"
        icon="scan"
        onPress={onPressMock}
        backgroundColor="#FFFFFF"
      />
    );

    fireEvent.press(getByText("Press Me"));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});
