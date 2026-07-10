// @ts-nocheck
import React, { useState } from "react";
import Layout from "../Common/Layout";
const SupportTicket = () => {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app this would POST to an API endpoint
        alert(`Ticket submitted:\nSubject: ${subject}\nDescription: ${description}`);
        setSubject("");
        setDescription("");
    };
    return (<Layout>
      <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Contact Support</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Subject</label>
            <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full border rounded p-2" required/>
          </div>
          <div>
            <label className="block mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border rounded p-2 h-32" required/>
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
            Submit Ticket
          </button>
        </form>
      </div>
    </Layout>);
};
export default SupportTicket;
