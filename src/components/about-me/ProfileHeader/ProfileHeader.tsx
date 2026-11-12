import { Avatar } from "@gi-org-pl/athena";

export interface ProfileHeaderProps {
  name: string;
  role: string;
  avatarSrc?: string;
}

const ProfileHeader = ({ name, role, avatarSrc }: ProfileHeaderProps) => {
  return (
    <header className="flex flex-col items-center gap-4 border-b border-gi-dark-ash pb-6 text-center sm:flex-row sm:text-left">
      <Avatar
        src={avatarSrc}
        alt={avatarSrc ? `${name} profile picture` : undefined}
        name={name}
        fallback="initials"
        size="large"
      />
      <div className="min-w-0 flex-1">
        <h1 className="break-words text-3xl font-bold text-gi-dark-primary sm:text-4xl">
          {name}
        </h1>
        <p className="mt-1 break-words text-lg font-medium text-gi-dark-gray">
          {role}
        </p>
      </div>
    </header>
  );
};

export default ProfileHeader;
