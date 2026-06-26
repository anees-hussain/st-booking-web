import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

import "./UserManagement.css";

import UserModal from "../../components/Modal/UserModal";
import PasswordModal from "../../components/Modal/PasswordModal";

const UserManagement = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  const [passwordModalVisible, setPasswordModalVisible] = useState(false);

  const [editingUser, setEditingUser] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  // ===========================
  // FETCH USERS
  // ===========================

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users");

      setUsers(response.data || []);
    } catch (error) {
      console.error(error);

      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // SEARCH
  // ===========================

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.designation?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [users, search]);

  // ===========================
  // CREATE USER
  // ===========================

  const openCreateModal = () => {
    setEditingUser(null);

    setModalVisible(true);
  };

  // ===========================
  // EDIT USER
  // ===========================

  const openEditModal = (user) => {
    setEditingUser(user);

    setModalVisible(true);
  };

  // ===========================
  // DELETE USER
  // ===========================

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) return;

    try {
      await API.delete(`/users/${id}`);

      fetchUsers();
    } catch (error) {
      console.error(error);

      alert("Delete failed.");
    }
  };

  // ===========================
  // CHANGE PASSWORD
  // ===========================

  const openPasswordModal = (id) => {
    setSelectedUserId(id);

    setPasswordModalVisible(true);
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            ← Back
          </button>

          <h1>User Management</h1>
        </div>

        <button className="add-btn" onClick={openCreateModal}>
          + Add User
        </button>
      </div>

      <input
        className="search-input"
        placeholder="Search Users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Full Name</th>

              <th>Username</th>

              <th>Designation</th>

              <th>Password</th>

              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" className="empty">
                  No Users Found
                </td>
              </tr>
            )}

            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.fullName}</td>

                <td>{user.username}</td>

                <td>{user.designation}</td>

                <td>••••••••</td>

                <td>
                  <button
                    className="edit-btn"
                    onClick={() => openEditModal(user)}
                  >
                    Edit
                  </button>

                  <button
                    className="password-btn"
                    onClick={() => openPasswordModal(user._id)}
                  >
                    Password
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        editingUser={editingUser}
        refreshUsers={fetchUsers}
      />

      <PasswordModal
        visible={passwordModalVisible}
        userId={selectedUserId}
        onClose={() => setPasswordModalVisible(false)}
      />
    </div>
  );
};

export default UserManagement;
