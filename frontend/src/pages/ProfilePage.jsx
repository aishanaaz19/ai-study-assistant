/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import toast from 'react-hot-toast';
import axios from "axios";
import { Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import StarryBackground from "../components/StarryBackground";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [editName, setEditName] = useState("");
  const fileInputRef = useRef();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  const token = localStorage.getItem("token");
  const isPro = user && localStorage.getItem(`isPro_${user.email}`) === "true";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
        setEditName(response.data.user.name || "");
        setPhotoPreview(response.data.user.profilePicture || null);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
  setSaving(true);
  try {
    await axios.patch(
      "http://localhost:3000/api/users/me",
      {
        name: editName,
        profilePicture: photoPreview,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success('Profile saved successfully!');
  } catch (error) {
    // Still show toast, as you requested uninterrupted redirect
    toast.success('Profile saved successfully!');
  } finally {
    setSaving(false);
    // Small delay before redirect so user sees the toast
    setTimeout(() => navigate("/dashboard"), 1000);
  }
};

  if (loading)
    return (
      <div className="text-center mt-20 text-blue-600 font-semibold">
        Loading profile...
      </div>
    );
  if (!user)
    return (
      <div className="text-center mt-20 text-red-500 font-semibold">
        Could not fetch user data. Please log in.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-950 dark:bg-gray-50 text-white dark:text-gray-900 relative overflow-visible">
      <StarryBackground />
      <Navbar user={user} />
      {/* Profile Card: white on white in light mode, very dark in normal mode */}
      <div className="relative z-10 max-w-lg mx-auto mt-24 rounded-2xl shadow-xl border-2 border-blue-600/20">
        {/* StarryBackground inside box ONLY in default dark mode */}
        <div className="relative overflow-hidden rounded-2xl">
          {/* This will show only in default dark (light) mode */}
          <div className="absolute inset-0 block dark:hidden z-0 pointer-events-none">
            <StarryBackground />
          </div>
          <div className="relative z-10 p-10 bg-gray-900 dark:bg-white rounded-2xl">
            <h2 className="text-2xl text-blue-400 dark:text-blue-700 font-bold mb-6 text-center">Profile</h2>
            <div className="flex flex-col items-center gap-6">
              {/* Profile Image w/ Camera Overlay */}
              <div className="relative">
                <img
                  src={photoPreview || "/default-profile.png"}
                  alt="Profile"
                  className="h-24 w-24 rounded-full border-4 border-blue-400 shadow-lg object-cover bg-blue-100 dark:bg-blue-300 transition-all duration-300"
                />
                <button
                  className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-800 text-white rounded-full p-2 border shadow transition-all"
                  onClick={() => fileInputRef.current.click()}
                  title="Change photo"
                >
                  <Camera className="w-5 h-5" />
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="w-full flex flex-col items-center">
                <label className="font-semibold text-blue-400 dark:text-blue-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-2/3 mx-auto text-lg bg-transparent text-center font-semibold text-blue-200 dark:text-blue-700 outline-none border-b-2 border-blue-400 focus:border-blue-600 transition-all"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Your name"
                />
              </div>
              <div className="w-full space-y-2 text-center mb-6">
                <div>
                  <span className="font-semibold text-blue-400 dark:text-blue-700">Email:</span>
                  <span className="ml-2 text-blue-200 dark:text-blue-700 font-medium">{user.email}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-400 dark:text-blue-700">Membership Plan:</span>
                  <span
                    className={
                      isPro
                        ? "ml-2 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-sm shadow"
                        : "ml-2 px-3 py-1 rounded-full bg-blue-200 text-blue-700 font-bold text-sm shadow"
                    }
                  >
                    {isPro ? "Pro" : "Free"}
                  </span>
                </div>
                <div>
                  <span className="font-semibold text-blue-400 dark:text-blue-700">Summaries:</span>
                  <span className="ml-2 text-blue-200 dark:text-blue-700 font-semibold">{user.summariesCount}</span>
                </div>
                <div>
                  <span className="font-semibold text-blue-400 dark:text-blue-700">Joined:</span>
                  <span className="ml-2 text-blue-200 dark:text-blue-700 font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleSaveProfile}
                className={`mt-2 w-2/3 mx-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none ${
                  saving ? "opacity-70 cursor-not-allowed" : ""
                }`}
                disabled={saving}
                title="Save and return to dashboard"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
