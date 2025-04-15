import { ProfileInformation } from "../components/profile-info";
import { UpdatePasswordForm } from "../components/update-password-form";

export default function SettingsPage() {
  return (
    <div className="container mx-auto">
      <div className="space-y-8">
        <ProfileInformation />
        <UpdatePasswordForm />
      </div>
    </div>
  );
}
