import React, { useContext, useEffect, useState } from "react";
import {AiOutlineCamera,AiOutlineClose,AiOutlineLoading3Quarters} from "react-icons/ai";
import { ContextApi } from "../../../../Context/Context";
import { useNavigate } from "react-router";

const Profile = () => {
    const { FetchUser, UpdateAvatar, UpdateProfile } = useContext(ContextApi);
    const [isEditing, setIsEditing] = useState(false);
    const [Loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const navigate = useNavigate();

    // Fetch user data
    const fetchUserData = async() => {
        try {
            const data = await FetchUser();
            setUser(data);
            setFormData(data);
            setImagePreview(data.avatar?.url || "/public/pic.jpg");
        } catch (err) {
            console.error("Error fetching user data:", err);
            setError("Failed to load user data.");
        }
    };

    // Update avatar
    const handleAvatarUpdate = async (e) => {
        const { files } = e.target;
        setLoading(true);
        if (files && files[0]) {
            const file = files[0];
            try {
                const updatedAvatar = await UpdateAvatar(file);
                setLoading(true);
                setImagePreview(updatedAvatar);
                setUser((prevUser) => ({
                    ...prevUser,
                    avatar: { url: updatedAvatar.url },
                }));
            } catch (err) {
                console.error("Error updating user avatar:", err);
                setError("Failed to update avatar.");
            } finally {
                setLoading(false);
            }
        }
    };

    // Update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedData = await UpdateProfile({ formData,navigate});
            setUser(updatedData);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error("Error during profile update:", err);
            setError("Failed to update profile.");
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const handleEditProfile = () => {
        setIsEditing(true);
        setError("");
    };

    const handleCloseForm = () => {
        setIsEditing(false);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                        {Loading ? (
                            <div className="w-36 h-36 rounded-full border-4 border-green-500 flex items-center justify-center bg-gray-100">
                                <AiOutlineLoading3Quarters className="w-10 h-10 text-green-500 animate-spin" />
                            </div>
                        ) : (
                            <img
                                src={imagePreview}
                                className="w-36 h-36 rounded-full object-cover border-4 border-green-500 transition-transform hover:scale-105"
                                alt="Profile"
                            />
                        )}
                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer absolute bottom-2 right-2">
                            <input
                                type="file"
                                onChange={handleAvatarUpdate}
                                id="image"
                                className="hidden"
                            />
                            <label htmlFor="image" className="cursor-pointer">
                                <AiOutlineCamera className="w-5 h-5 text-gray-600" />
                            </label>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.fullName || "User"}</h2>
                    <h5 className="text-lg font-bold text-gray-800 mb-2">{user.userName || "User_123"}</h5>
                    <p className="text-gray-600 mb-1">{user.email || "user123@gmail.com"}</p>
                    <p className="text-gray-600 mb-4">{user.country || "USA"}</p>
                    <button
                        onClick={handleEditProfile}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:scale-105"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {isEditing && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
                        <button
                            onClick={handleCloseForm}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <AiOutlineClose size={24} />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Edit Profile</h2>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
                                    User Name
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    name="userName"
                                    value={formData.userName || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email || ""}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border rounded-md"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={handleCloseForm}
                                    className="px-4 py-2 border rounded-md text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                                >
                                    {Loading ? <AiOutlineLoading3Quarters size={20} className="text-green-500 animate-spin" /> : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;


