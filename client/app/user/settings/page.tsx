import { ProfileInformation } from "../components/profile-info";

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <ProfileInformation />
      </div>
    </div>
  );
}
