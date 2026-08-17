import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getProfile } from "../../services/profile.service";

const Profile = () => {
  const { currentUser } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProfile();

        setProfile(data);
      } catch (error) {
        console.error("Failed to load profile:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load profile information."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-text-secondary">
          Loading profile...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-danger">
          {error}
        </p>
      </div>
    );
  }

  // The backend response may contain the user and profile separately.
  const user = profile?.user || currentUser;
  const userProfile = profile?.profile || profile;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">
          My Profile
        </h1>

        <p className="mt-1 text-sm text-text-secondary">
          View and manage your personal information.
        </p>
      </div>

      {/* Profile Header */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* Profile Image / Avatar */}
          {userProfile?.profileImage ? (
            <img
              src={userProfile.profileImage}
              alt="Profile"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
              {user?.firstName?.charAt(0)}
            </div>
          )}

          {/* User Information */}
          <div>
            <h2 className="text-xl font-semibold text-text-primary">
              {user?.firstName} {user?.lastName}
            </h2>

            <p className="mt-1 text-sm capitalize text-text-secondary">
              {user?.role || "—"}
            </p>

            <p className="mt-1 text-sm text-text-secondary">
              {user?.email || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Personal Information */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">
          Personal Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              First Name
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {user?.firstName || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Last Name
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {user?.lastName || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Date of Birth
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {user?.dateOfBirth || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              ID Number
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {user?.idNumber || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Email Address
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {user?.email || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Role
            </p>

            <p className="mt-1 text-sm capitalize text-text-primary">
              {user?.role || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Profile Information */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-text-primary">
          Profile Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-text-secondary">
              Phone Number
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {userProfile?.phoneNumber || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Gender
            </p>

            <p className="mt-1 text-sm capitalize text-text-primary">
              {userProfile?.gender || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Marital Status
            </p>

            <p className="mt-1 text-sm capitalize text-text-primary">
              {userProfile?.maritalStatus || "—"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-text-secondary">
              Address
            </p>

            <p className="mt-1 text-sm text-text-primary">
              {userProfile?.address || "—"}
            </p>
          </div>

          <div className="md:col-span-2">
            <p className="text-sm font-medium text-text-secondary">
              Bio
            </p>

            <p className="mt-1 whitespace-pre-wrap text-sm text-text-primary">
              {userProfile?.bio || "—"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;