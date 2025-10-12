import { useState, useEffect } from 'react';
import api from '../utils/api';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { user: currentUser } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // For now, we'll create a users endpoint or use auth data
      // This is a placeholder - you may need to create /api/users endpoint
      const response = await api.get('/auth/me');
      // In a real app, you'd have a /api/users endpoint
      // For demo, we'll show current user info
      setUsers([response.data.data]);
    } catch (error) {
      console.error('Failed to load users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      toast.success('User created successfully');
      closeModal();
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create user');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'staff'
    });
  };

  const getRoleBadge = (role) => {
    const colors = {
      admin: 'bg-danger text-white',
      manager: 'bg-accent text-white',
      staff: 'bg-info text-white'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[role]}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-text-primary">User Management</h1>
          {currentUser?.role === 'admin' && (
            <Button onClick={() => setShowModal(true)}>
              + Add User
            </Button>
          )}
        </div>

        {/* Users Table */}
        <Card>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-text-muted">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Name</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Email</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Role</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Status</th>
                    <th className="text-left py-3 px-2 text-text-secondary text-sm font-semibold">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id || user.id} className="border-b border-border hover:bg-gray-50">
                      <td className="py-3 px-2 font-medium">{user.name}</td>
                      <td className="py-3 px-2">{user.email}</td>
                      <td className="py-3 px-2">{getRoleBadge(user.role)}</td>
                      <td className="py-3 px-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-text-muted text-sm">
                        {new Date(user.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Info Card */}
        <Card className="bg-blue-50 border-l-4 border-primary">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <h3 className="font-semibold text-text-primary mb-1">User Management (Admin Only)</h3>
              <p className="text-sm text-text-muted">
                This page allows administrators to manage user accounts. Create new users with different roles (Admin, Manager, Staff) and control access levels.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Add New User</h2>
                <button
                  onClick={closeModal}
                  className="text-text-muted hover:text-text-primary text-2xl"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Full Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Email Address <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Password <span className="text-danger">*</span>
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength="6"
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-text-secondary text-sm font-medium mb-2">
                    Role <span className="text-danger">*</span>
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button type="button" variant="secondary" onClick={closeModal}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create User
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Users;
