import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/common/Button";
import {
  getProfile,
  updateProfile,
  uploadProfileImage,
} from "../../services/profile.service";

const Profile = () => {
  const { checkAuth } = useAuth();

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
  const [saveError, setSaveError] = useState("");

  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageError, setImageError] = useState("");
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
    setSaveError("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setSaveError("");
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
      setSaveError("");

      await updateProfile(formData);

      await loadProfile();
      await checkAuth();

      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);

      setSaveError(
        error.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageSelected = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setImageError("");

      await uploadProfileImage(file);

      await loadProfile();
      await checkAuth();
    } catch (error) {
      console.error("Failed to upload image:", error);

      setImageError(error.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingImage(false);
      // Reset the input so selecting the same file again still triggers change
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Profile</h1>
          <p className="mt-1 text-sm text-text-secondary">
            View and manage your personal information.
          </p>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={startEditing}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile Header */}
      <section className="rounded-xl border border-border bg-surface p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          {/* Avatar (click to upload) */}
          <div className="relative">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadingImage}
              title="Click to change profile picture"
              className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-600/15 text-2xl font-bold text-primary-500 ring-2 ring-primary-600/30 transition disabled:cursor-not-allowed"
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

              {/* Hover overlay */}
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100">
                {uploadingImage ? "Uploading..." : "Change"}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelected}
              className="hidden"
            />
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
            {imageError && (
              <p className="mt-2 text-xs text-danger">{imageError}</p>
            )}
          </div>
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
            <p className="text-sm font-medium text-text-secondary">Last Name</p>
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
            <p className="text-sm font-medium text-text-secondary">ID Number</p>
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
              <p className="text-sm font-medium text-text-secondary">Gender</p>
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
              <p className="text-sm font-medium text-text-secondary">Address</p>
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
            {saveError && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
                {saveError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="maritalStatus"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Marital Status
                </label>
                <select
                  id="maritalStatus"
                  name="maritalStatus"
                  value={formData.maritalStatus}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Select</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="bio"
                  className="mb-2 block text-sm font-medium text-text-primary"
                >
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  disabled={saving}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-text-primary outline-none transition focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
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
