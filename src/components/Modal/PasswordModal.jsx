import { useEffect, useState } from "react";
import API from "../../api/api";

import "./PasswordModal.css";

const PasswordModal = ({ visible, onClose, userId }) => {
  const [password, setPassword] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setPassword("");
    }
  }, [visible]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password.trim()) {
      return alert("Please enter a new password.");
    }

    try {
      setSaving(true);

      await API.patch(`/users/change-password/${userId}`, {
        password,
      });

      alert("Password changed successfully.");

      setPassword("");

      onClose();
    } catch (error) {
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to change password.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className="password-modal">
        <h2>Change Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" className="save-btn" disabled={saving}>
              {saving ? "Updating..." : "Update Password"}
            </button>

            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
