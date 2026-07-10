/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable */
// @ts-nocheck
import { useState } from "react";
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
    return (_jsx(Layout, { children: _jsxs("div", { className: "max-w-xl mx-auto p-4", children: [_jsx("h1", { className: "text-2xl font-bold mb-4", children: "Contact Support" }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block mb-1", children: "Subject" }), _jsx("input", { type: "text", value: subject, onChange: (e) => setSubject(e.target.value), className: "w-full border rounded p-2", required: true })] }), _jsxs("div", { children: [_jsx("label", { className: "block mb-1", children: "Description" }), _jsx("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full border rounded p-2 h-32", required: true })] }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded", children: "Submit Ticket" })] })] }) }));
};
export default SupportTicket;
