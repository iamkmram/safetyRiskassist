 
 
import React, { useState } from "react";
// @ts-ignore
// @ts-ignore
import { any } from "../../../utils/mockData";

export default function ProfileEditor() {
  const [profile, setProfile] = useState<any>(any);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // In a real app, call an API. Here we just log.
    console.log("Saved profile:", profile);
    alert("Profile saved successfully!");
  };

  return (
    <form className="space-y-4">
      <div>
        <label>Name</label>
        <input name="name" value={profile.name} onChange={handleChange} />
      </div>
      <div>
        <label>Email</label>
        <input name="email" value={profile.email} onChange={handleChange} />
      </div>
      <div>
        <label>Department</label>
        <input name="department" value={profile.department} onChange={handleChange} />
      </div>
      <div>
        <label>Role</label>
        <input name="role" value={profile.role} onChange={handleChange} />
      </div>
      <button type="button" onClick={handleSave}>Save Changes</button>
    </form>
  );
}
