import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/profile.service";
import Button from "../../components/common/Button";
import FormField from "../../components/forms/FormField";
import Loader, { Spinner } from "../../components/common/Loader";

const PencilIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
);

const CameraIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const UserIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const CalendarIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IdIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <circle cx="9" cy="12" r="2" />
    <line x1="15" y1="9" x2="19" y2="9" />
    <line x1="15" y1="15" x2="19" y2="15" />
  </svg>
);

const MailIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 6-10 7L2 6" />
  </svg>
);

const ShieldIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
  </svg>
);

const PhoneIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z" />
  </svg>
);

const GenderIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="8" r="5" />
    <path d="M12 13v9" />
    <path d="M9 18h6" />
  </svg>
);

const HeartIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z" />
  </svg>
);

const MapPinIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const NoteIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2Z" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="13" y2="17" />
  </svg>
);

// Role -> color mapping, same convention used on the Users page
const roleBadgeColors = {
  admin: "bg-danger/15 text-danger",
  manager: "bg-warning/15 text-warning",
  employee: "bg-primary-600/15 text-primary-500",
};

const roleDotColors = {
  admin: "bg-danger",
  manager: "bg-warning",
  employee: "bg-primary-500",
};

const InfoField = ({ icon: Icon, iconColor, label, value }) => (
  <div className="flex items-start gap-3">
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconColor}`}
    >
      <Icon className="h-4 w-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium text-text-secondary">{label}</p>
      <p className="mt-0.5 truncate text-sm text-text-primary">
        {value || "—"}
      </p>
    </div>
  </div>
);

const Profile = () => {
  const { checkAuth } = useAuth();
  const { showToast } = useToast();

  const [user, setUser] = useState(null);
  const [profileInfo, setProfileInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    gender: "",
    maritalStatus: "",
    address: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProfile();

      setUser(data.user);
      setProfileInfo(data.profile);
    } catch (error) {
      console.error("Failed to load profile:", error);

      setError(
        error.response?.data?.message || "Failed to load profile information.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const startEditing = () => {
    setFormData({
      phoneNumber: profileInfo?.phoneNumber || "",
      gender: profileInfo?.gender || "",
      maritalStatus: profileInfo?.maritalStatus || "",
      address: profileInfo?.address || "",
      bio: profileInfo?.bio || "",
    });
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      await updateProfile(formData);

      await loadProfile();
      await checkAuth();

      setIsEditing(false);
      showToast("Profile updated successfully.", "success");
    } catch (error) {
      console.error("Failed to update profile:", error);

      showToast(
        error.response?.data?.message || "Failed to update profile.",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    if (!isEditing) {
      return;
    }

    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);

      await uploadProfileImage(file);

      await loadProfile();
      await checkAuth();

      showToast("Profile picture updated.", "success");
    } catch (error) {
      console.error("Failed to upload image:", error);

      showToast(
        error.response?.data?.message || "Failed to upload image.",
        "error",
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-danger/30 bg-danger/10 p-6">
        <p className="text-sm font-medium text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {/* Your account details and settings. */}
        </p>
      </div>

      {/* Profile Header with banner */}
      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        {/* Gradient banner with pattern + dual glow */}
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-sidebar">
          {/* Subtle dot-grid pattern for texture */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />

          {/* Dual glow — blue + brand orange */}
          <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-primary-400/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-[#f5821f]/20 blur-3xl" />

          {!isEditing && (
            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={startEditing}
                className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
              >
                <PencilIcon className="h-3.5 w-3.5" />
                Edit Profile
              </button>
            </div>
          )}
        </div>

        {/* Avatar overlaps the banner; text sits fully below it */}
        <div className="px-6 pb-6">
          <div className="relative -mt-12">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingImage}
              title={isEditing ? "Click to change profile picture" : ""}
              className={`group relative flex h-[150px] w-[150px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600/15 text-3xl font-bold text-primary-500 shadow-xl ring-4 ring-surface transition ${
                isEditing ? "cursor-pointer" : "cursor-default"
              } disabled:cursor-not-allowed`}
            >
              {profileInfo?.profileImage ? (
                <img
                  src={profileInfo.profileImage}
                  alt="Profile"
                  className="h-full w-full object-cover"
                />
              ) : (
                user?.firstName?.charAt(0)
              )}

              {isEditing && (
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition group-hover:opacity-100">
                  {uploadingImage ? (
                    <Spinner size="sm" className="border-white" />
                  ) : (
                    <CameraIcon className="h-6 w-6 text-white" />
                  )}
                </span>
              )}
            </button>

            {/* Role-colored status dot on the avatar's edge */}
            <span
              className={`absolute bottom-1 right-1 h-5 w-5 rounded-full ring-4 ring-surface ${
                roleDotColors[user?.role] || "bg-primary-500"
              }`}
            />

            {isEditing && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelected}
                className="hidden"
              />
            )}
          </div>

          {/* Name/role/email — fully below the banner, not overlapping it */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold text-text-primary">
              {user?.firstName} {user?.lastName}
            </h2>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                  roleBadgeColors[user?.role] ||
                  "bg-primary-600/15 text-primary-500"
                }`}
              >
                {user?.role || "—"}
              </span>
              <span className="text-sm text-text-secondary">
                {user?.email || "—"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Information (read-only) */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Account Information
        </h2>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <InfoField
            icon={UserIcon}
            iconColor="bg-primary-600/15 text-primary-500"
            label="First Name"
            value={user?.firstName}
          />
          <InfoField
            icon={UserIcon}
            iconColor="bg-primary-600/15 text-primary-500"
            label="Last Name"
            value={user?.lastName}
          />
          <InfoField
            icon={CalendarIcon}
            iconColor="bg-warning/15 text-warning"
            label="Date of Birth"
            value={
              user?.dateOfBirth
                ? new Date(user.dateOfBirth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : null
            }
          />
          <InfoField
            icon={IdIcon}
            iconColor="bg-success/15 text-success"
            label="ID Number"
            value={user?.idNumber}
          />
          <InfoField
            icon={MailIcon}
            iconColor="bg-primary-600/15 text-primary-500"
            label="Email Address"
            value={user?.email}
          />
          <InfoField
            icon={ShieldIcon}
            iconColor="bg-danger/15 text-danger"
            label="Role"
            value={user?.role}
          />
        </div>
      </section>

      {/* Personal Details — view or edit */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Personal Details
        </h2>

        {!isEditing ? (
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <InfoField
              icon={PhoneIcon}
              iconColor="bg-primary-600/15 text-primary-500"
              label="Phone Number"
              value={profileInfo?.phoneNumber}
            />
            <InfoField
              icon={GenderIcon}
              iconColor="bg-warning/15 text-warning"
              label="Gender"
              value={profileInfo?.gender}
            />
            <InfoField
              icon={HeartIcon}
              iconColor="bg-danger/15 text-danger"
              label="Marital Status"
              value={profileInfo?.maritalStatus}
            />
            <InfoField
              icon={MapPinIcon}
              iconColor="bg-success/15 text-success"
              label="Address"
              value={profileInfo?.address}
            />
            <div className="sm:col-span-2">
              <InfoField
                icon={NoteIcon}
                iconColor="bg-primary-600/15 text-primary-500"
                label="Bio"
                value={profileInfo?.bio}
              />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={saving}
              />

              <FormField
                label="Gender"
                name="gender"
                type="select"
                value={formData.gender}
                onChange={handleChange}
                disabled={saving}
                options={[
                  { value: "", label: "Select" },
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />

              <FormField
                label="Marital Status"
                name="maritalStatus"
                type="select"
                value={formData.maritalStatus}
                onChange={handleChange}
                disabled={saving}
                options={[
                  { value: "", label: "Select" },
                  { value: "single", label: "Single" },
                  { value: "married", label: "Married" },
                ]}
              />

              <FormField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                disabled={saving}
              />

              <FormField
                label="Bio"
                name="bio"
                type="textarea"
                value={formData.bio}
                onChange={handleChange}
                disabled={saving}
                className="md:col-span-2"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" loading={saving}>
                Save Changes
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={cancelEditing}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};

export default Profile;