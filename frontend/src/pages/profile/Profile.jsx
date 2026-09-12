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
        error.response?.data?.message ||
          "Failed to load profile information."
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
        "error"
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
        "error"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-text-secondary">Loading profile...</p>
      </div>
    );
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
          View and manage your personal information.
        </p>
      </div>

      {/* Profile Header */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            {/* Avatar (editable only while isEditing) */}
            <div className="relative">
              <button
                type="button"
                onClick={handleAvatarClick}
                disabled={uploadingImage}
                title={isEditing ? "Click to change profile picture" : ""}
                className={`group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600/15 text-2xl font-bold text-primary-500 ring-2 ring-primary-600/30 transition ${
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
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      <CameraIcon className="h-6 w-6 text-white" />
                    )}
                  </span>
                )}
              </button>

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

          {/* Edit icon button */}
          {!isEditing && (
            <Button
              variant="icon"
              size="icon"
              onClick={startEditing}
              title="Edit Profile"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          )}
        </div>
      </section>

      {/* Personal Information (read-only) */}
      <section className="rounded-xl border border-border bg-surface p-6">
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
            <p className="text-sm font-medium text-text-secondary">Role</p>
            <p className="mt-1 text-sm capitalize text-text-primary">
              {user?.role || "—"}
            </p>
          </div>
        </div>
      </section>

      {/* Profile Information — view or edit */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-text-primary">
          Profile Information
        </h2>

        {!isEditing ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-text-secondary">
                Phone Number
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {profileInfo?.phoneNumber || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Gender
              </p>
              <p className="mt-1 text-sm capitalize text-text-primary">
                {profileInfo?.gender || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Marital Status
              </p>
              <p className="mt-1 text-sm capitalize text-text-primary">
                {profileInfo?.maritalStatus || "—"}
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-text-secondary">
                Address
              </p>
              <p className="mt-1 text-sm text-text-primary">
                {profileInfo?.address || "—"}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-sm font-medium text-text-secondary">Bio</p>
              <p className="mt-1 whitespace-pre-wrap text-sm text-text-primary">
                {profileInfo?.bio || "—"}
              </p>
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