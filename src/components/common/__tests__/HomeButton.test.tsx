import React from "react";
import { render, screen } from "@testing-library/react-native";
import HomeButton from "../HomeButton";
import { Colors } from "../../../constants/Colors";
import { Strings } from "../../../constants/Strings";

describe("HomeButton", () => {
  it("should render the title correctly", () => {
    render(
      <HomeButton
        title={Strings.home.cameraButton}
        icon="camera"
        backgroundColor={Colors.primary}
      />
    );

    const buttonTitle = screen.getByText(Strings.home.cameraButton);

    expect(buttonTitle).toBeTruthy();
  });
});
