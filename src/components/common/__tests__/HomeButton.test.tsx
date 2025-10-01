import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import HomeButton from "../HomeButton";
import { lightColors } from "../../../constants/Colors";

jest.mock("../../../hooks/useAppTheme", () => ({
  useAppTheme: () => ({
    colors: lightColors,
  }),
}));

describe("HomeButton", () => {
  const defaultProps = {
    title: "Tombol Uji",
    icon: "camera" as "camera",
    backgroundColor: lightColors.primary,
    onPress: jest.fn(),
  };

  it("should render the title and icon correctly", () => {
    render(<HomeButton {...defaultProps} />);

    const buttonTitle = screen.getByText("Tombol Uji");
    expect(buttonTitle).toBeTruthy();
  });

  it("should render correctly with default (vertical) layout", () => {
    const { toJSON } = render(<HomeButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("should render correctly with horizontal layout", () => {
    const { toJSON } = render(
      <HomeButton {...defaultProps} layout="horizontal" />
    );
    expect(toJSON()).toMatchSnapshot();
  });

  it("calls onPress prop when pressed", () => {
  const onPressMock = jest.fn();
  render(<HomeButton {...defaultProps} onPress={onPressMock} />);

  const button = screen.getByText("Tombol Uji");
  fireEvent.press(button);

  expect(onPressMock).toHaveBeenCalledTimes(1);
});
});
