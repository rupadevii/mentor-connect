import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { fileToBase64, getInitials } from '../utils/helpers';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    level: '1',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const setUserIntoForm = (currentUser) => {
    setFormData({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      level: String(currentUser?.level || 1),
    });
    setPreviewUrl(currentUser?.profilePicture?.url || '');
  };

  useEffect(() => {
    const loadProfile = async () => {
      setIsFetching(true);
      setError('');

      try {
        const response = await api.get('/auth/me');
        const currentUser = response?.data?.user;
        setUser(currentUser);
        setUserIntoForm(currentUser);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setIsFetching(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image size should be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleEdit = () => {
    setSuccess('');
    setError('');
    setIsEditing(true);
  };

  const handleCancel = () => {
    setUserIntoForm(user);
    setSelectedFile(null);
    setSuccess('');
    setError('');
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        level: Number(formData.level),
      };

      if (selectedFile) {
        payload.profileImage = await fileToBase64(selectedFile);
      }

      const response = await api.put('/users/profile', payload);
      const updatedUser = response?.data?.user;
      setUser(updatedUser);
      setUserIntoForm(updatedUser);
      window.dispatchEvent(new CustomEvent('profile-updated', { detail: updatedUser }));
      setSelectedFile(null);
      setIsEditing(false);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="rounded-lg bg-white shadow p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Profile</h1>
          <p className="text-slate-600 mb-6">View and update your profile information</p>

          {error && <Alert type="error" message={error} />}
          {success && <Alert type="success" message={success} />}

          {isFetching ? (
            <p className="text-slate-600">Loading profile...</p>
          ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4 pb-2">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-indigo-600 text-white flex items-center justify-center text-xl font-bold border border-slate-200">
                {previewUrl ? (
                  <img src={previewUrl} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  getInitials(formData.name || user?.name || 'User')
                )}
              </div>

              {isEditing && (
                <div>
                  <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
                    Upload photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                  <p className="text-xs text-slate-500 mt-2">Max size: 5MB</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Level</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 bg-white transition-colors duration-200 border-slate-300 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-500"
              >
                {[1, 2, 3, 4, 5, 6].map((level) => (
                  <option key={level} value={level}>
                    Level {level}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 pt-4">
              {!isEditing ? (
                <Button variant="primary" type="button" onClick={handleEdit}>
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="secondary" type="button" onClick={handleCancel} disabled={isLoading}>
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
