import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';

function UserInformation(){
  const { user, setUser } = useUser();

  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : { ...user, gender: 'Male', profileImage: 'https://via.placeholder.com/150' };
  });

  const [isUpdated, setIsUpdated] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value,
    });
    setIsUpdated(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevState) => ({
          ...prevState,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(profile);  

    localStorage.setItem('userProfile', JSON.stringify(profile));

    setIsUpdated(true); 
  };

  return (
    <div className="max-w-xl mx-auto py-12">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Edit Your Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8">

        <div className="mb-6 text-center">
          <img
            src={profile.profileImage}
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4"
          />
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={profile.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={profile.email}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={profile.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-all"
        >
          Update Profile
        </button>

        {isUpdated && <p className="text-green-600 text-center mt-4">Profile updated successfully!</p>}
      </form>
    </div>
  );
};

export default UserInformation;
