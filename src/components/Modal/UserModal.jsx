import { useEffect, useState } from "react";
import API from "../../api/api";

import "./UserModal.css";

const UserModal = ({ visible, onClose, editingUser, refreshUsers }) => {
  const [fullName, setFullName] = useState("");

  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");

  const [designation, setDesignation] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingUser) {
      setFullName(editingUser.fullName || "");
      setUsername(editingUser.username || "");
      setDesignation(editingUser.designation || "");
      setPassword("");
    } else {
      resetForm();
    }
  }, [editingUser, visible]);

  const resetForm = () => {
    setFullName("");
    setUsername("");
    setPassword("");
    setDesignation("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      return alert("Please enter full name.");
    }

    if (!designation.trim()) {
      return alert("Please enter designation.");
    }

    if (!editingUser) {
      if (!username.trim()) {
        return alert("Please enter username.");
      }

      if (!password.trim()) {
        return alert("Please enter password.");
      }
    }

    try {
      setSaving(true);

      if (editingUser) {
        await API.put(`/users/${editingUser._id}`, {
          fullName,
          designation,
        });

        alert("User updated successfully.");
      } else {
        await API.post("/users/register", {
          fullName,
          username,
          password,
          designation,
        });

        alert("User created successfully.");
      }

      refreshUsers();

      onClose();

      resetForm();
    } catch (error) {
      alert(
        error?.response?.data?.message || error?.message || "Operation failed.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="user-modal">
        <h2>{editingUser ? "Update User" : "Create User"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            placeholder="Username"
            value={username}
            disabled={!!editingUser}
            onChange={(e) => setUsername(e.target.value)}
          />

          {!editingUser && (
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          )}

          <select
            value={designation}
            onChange={(e) => setDesignation(e.target.value)}
          >
            <option value="">Select Designation</option>

            <option value="controller">Controller</option>

            <option value="manager">Manager</option>

            <option value="producer">Producer</option>

            <option value="seller">Seller</option>

            <option value="deliveryman">Delivery Man</option>
          </select>

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving
                ? "Saving..."
                : editingUser
                  ? "Update User"
                  : "Create User"}
            </button>

            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                onClose();
                resetForm();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
