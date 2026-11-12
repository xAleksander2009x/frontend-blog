import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AboutBio from "./AboutBio";

describe("<AboutBio />", () => {
  it("renders section title, paragraphs, and interest badges", () => {
    // Given
    const props = {
      title: "About Me",
      paragraphs: [
        "I am a passionate software developer.",
        "Currently building full-stack web applications.",
      ],
      interests: ["TypeScript", "React", "NestJS"],
    };

    // When
    render(<AboutBio {...props} />);

    // Then
    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(
      screen.getByText("I am a passionate software developer."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Currently building full-stack web applications."),
    ).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("NestJS")).toBeInTheDocument();
  });

  it("hides the interests block when interests array is empty", () => {
    // Given
    const props = {
      title: "About Me",
      paragraphs: ["Short bio text."],
      interests: [],
    };

    // When
    render(<AboutBio {...props} />);

    // Then
    expect(
      screen.queryByText("Interests & Technologies"),
    ).not.toBeInTheDocument();
  });
});
