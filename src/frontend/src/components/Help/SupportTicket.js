"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
/* eslint-disable */
/* eslint-disable */
// @ts-nocheck
const react_1 = require("react");
const Layout_1 = __importDefault(require("../Common/Layout"));
const SupportTicket = () => {
    const [subject, setSubject] = (0, react_1.useState)("");
    const [description, setDescription] = (0, react_1.useState)("");
    const handleSubmit = (e) => {
        e.preventDefault();
        // In a real app this would POST to an API endpoint
        alert(`Ticket submitted:\nSubject: ${subject}\nDescription: ${description}`);
        setSubject("");
        setDescription("");
    };
    return ((0, jsx_runtime_1.jsx)(Layout_1.default, { children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-xl mx-auto p-4", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-2xl font-bold mb-4", children: "Contact Support" }), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit, className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block mb-1", children: "Subject" }), (0, jsx_runtime_1.jsx)("input", { type: "text", value: subject, onChange: (e) => setSubject(e.target.value), className: "w-full border rounded p-2", required: true })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "block mb-1", children: "Description" }), (0, jsx_runtime_1.jsx)("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full border rounded p-2 h-32", required: true })] }), (0, jsx_runtime_1.jsx)("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded", children: "Submit Ticket" })] })] }) }));
};
exports.default = SupportTicket;
