import type { Meta, StoryObj } from "@storybook/react-vite";
import ProfileHeader from "./ProfileHeader";

const meta: Meta<typeof ProfileHeader> = {
  title: "AboutMe/ProfileHeader",
  component: ProfileHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProfileHeader>;

export const Default: Story = {
  args: {
    name: "Aleksander Węgrzyn",
    role: "Full-Stack Developer Intern",
  },
};

export const WithAvatarImage: Story = {
  args: {
    name: "Aleksander Węgrzyn",
    role: "Full-Stack Developer Intern",
    avatarSrc: "https://githubusercontent.com",
  },
};

export const LongNameWrapping: Story = {
  args: {
    name: "AleksanderMaksymilianKonstantynopolitańczykowianeczka Węgrzyn",
    role: "JuniorSoftwareEngineerWorkingOnModernWebApplications",
  },
};
