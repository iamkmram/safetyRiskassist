/* eslint-disable */
/* eslint-disable */
import React, { useState } from "react";

export default function SecurityTab() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (passwords.new !== passwords.confirm) {
      alert("New passwords do not match!");
      return;
    }
    console.log("Password change request:", passwords);
    alert("Password changed successfully!");
  };

  return (
    <form className="space-y-4">
      <div>
        <label>Current Password</label>
        <input type="password" name="current" value={passwords.current} onChange={handleChange} />
      </div>
      <div>
        <label>New Password</label>
        <input type="password" name="new" value={passwords.new} onChange={handleChange} />
      </div>
      <div>
        <label>Confirm New Password</label>
        <input type="password" name="confirm" value={passwords.confirm} onChange={handleChange} />
      </div>
      <button type="button" onClick={handleSave}>Change Password</button>
    </form>
  );
}
