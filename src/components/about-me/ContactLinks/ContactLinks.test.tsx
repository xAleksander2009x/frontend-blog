import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ContactLinks from "./ContactLinks";

describe("<ContactLinks />", () => {
  it("renders accessible links with proper href attributes", () => {
    // Given
    const props = {
      title: "Get in Touch",
      links: [
        { label: "GitHub", href: "https://github.com" },
        { label: "Email", href: "mailto:aleksander@example.com" },
      ],
    };

    // When
    render(<ContactLinks {...props} />);

    // Then
    const githubLink = screen.getByRole("link", { name: "GitHub" });
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute("href", "https://github.com");

    const emailLink = screen.getByRole("link", { name: "Email" });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute("href", "mailto:aleksander@example.com");
  });
});
