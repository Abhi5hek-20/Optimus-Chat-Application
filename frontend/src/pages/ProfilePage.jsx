import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuthUser from "../hooks/useAuthUser";
import { updateUserProfile } from "../lib/api";
import { Camera, Mail, User, RefreshCw, Edit, Save, X } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();
  const [isGeneratingAvatar, setIsGeneratingAvatar] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bio: authUser?.bio || "",
  });

  // Mutation for updating profile
  const { mutate: updateProfileMutation, isPending: isUpdating } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    },
  });

  // Function to generate a random profile picture
  const generateRandomAvatar = () => {
    setIsGeneratingAvatar(true);
    const randomId = Math.floor(Math.random() * 100) + 1;
    const newAvatarUrl = `https://avatar.iran.liara.run/public/${randomId}`;
    
    // Update the profile picture via API
    updateProfileMutation(
      { profilePic: newAvatarUrl },
      {
        onSettled: () => setIsGeneratingAvatar(false),
      }
    );
  };

  const handleSaveProfile = () => {
    updateProfileMutation(editData);
  };

  const handleCancelEdit = () => {
    setEditData({
      bio: authUser?.bio || "",
    });
    setIsEditing(false);
  };

  if (!authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-base-content/70">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body p-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="avatar size-32 mb-4">
                  <img
                    src={
                      authUser.profilePic ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        authUser.Fullname
                      )}&background=570df8&color=fff&size=128`
                    }
                    alt="Profile"
                    className="rounded-full object-cover w-full h-full"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        authUser.Fullname
                      )}&background=570df8&color=fff&size=128`;
                    }}
                  />
                </div>
                
                {/* Generate New Avatar Button */}
                <button
                  className={`btn btn-circle btn-primary absolute -bottom-2 -right-2 ${
                    isGeneratingAvatar ? "loading" : ""
                  }`}
                  onClick={generateRandomAvatar}
                  disabled={isGeneratingAvatar}
                  title="Generate random avatar"
                >
                  {!isGeneratingAvatar && <RefreshCw className="w-4 h-4" />}
                </button>
              </div>
              
              <button
                className="btn btn-outline btn-sm mt-2"
                onClick={generateRandomAvatar}
                disabled={isGeneratingAvatar}
              >
                {isGeneratingAvatar ? (
                  <>
                    <span className="loading loading-spinner loading-xs mr-2"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Generate Random Avatar
                  </>
                )}
              </button>
            </div>

            {/* User Information */}
            <div className="space-y-6">
              {/* Full Name */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Full Name
                  </span>
                </label>
                <div className="input input-bordered flex items-center gap-3 bg-base-100">
                  <span className="text-base-content">{authUser.Fullname}</span>
                </div>
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </span>
                </label>
                <div className="input input-bordered flex items-center gap-3 bg-base-100">
                  <span className="text-base-content">{authUser.email}</span>
                </div>
              </div>

              {/* Bio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Bio</span>
                </label>
                {isEditing ? (
                  <textarea
                    className="textarea textarea-bordered bg-base-100 min-h-20 ml-3"
                    placeholder="Tell us about yourself..."
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  />
                ) : (
                  <div className="textarea textarea-bordered bg-base-100 min-h-20">
                    {authUser.bio || "No bio added yet"}
                  </div>
                )}
              </div>

            </div>

            {/* Action Buttons */}
            <div className="card-actions justify-center mt-8 gap-4">
              {isEditing ? (
                <>
                  <button 
                    className="btn btn-success"
                    onClick={handleSaveProfile}
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <span className="loading loading-spinner loading-xs mr-2"></span>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button 
                    className="btn btn-outline"
                    onClick={handleCancelEdit}
                    disabled={isUpdating}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body text-center">
              <h3 className="font-semibold text-lg">Account Created</h3>
              <p className="text-sm opacity-70">
                {new Date(authUser.createdAt).toLocaleDateString('en-GB') || "Recently"}
              </p>
            </div>
          </div>
          
          <div className="card bg-base-200 shadow-sm">
            <div className="card-body text-center">
              <h3 className="font-semibold text-lg">Profile Status</h3>
              <div className="flex justify-center ">
                <div className="badge badge-success">Active</div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
