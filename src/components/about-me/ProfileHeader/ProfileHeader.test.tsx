import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProfileHeader from "./ProfileHeader";

describe("<ProfileHeader />", () => {
  it("renders the author name as the main heading and displays the role", () => {
    // Given
    const props = {
      name: "Aleksander Węgrzyn",
      role: "Full-Stack Developer Intern",
    };

    // When
    render(<ProfileHeader {...props} />);

    // Then
    expect(
      screen.getByRole("heading", { level: 1, name: "Aleksander Węgrzyn" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Full-Stack Developer Intern")).toBeInTheDocument();
  });

  it("renders an accessible image alt text when avatarSrc is provided", () => {
    // Given
    const props = {
      name: "Aleksander Węgrzyn",
      role: "Developer",
      avatarSrc: "https://example.com",
    };

    // When
    render(<ProfileHeader {...props} />);

    // Then
    expect(
      screen.getByRole("img", { name: "Aleksander Węgrzyn avatar" }),
    ).toBeInTheDocument();
  });
});
