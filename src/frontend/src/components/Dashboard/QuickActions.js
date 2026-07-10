/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const actions = [
    {
        title: "Latest COVID-19 Restrictions",
        description: "Get current travel requirements",
        route: "/chat",
    },
    {
        title: "High-Risk Destinations",
        description: "View current travel warnings",
        route: "/chat",
    },
    {
        title: "Emergency Protocols",
        description: "Access emergency procedures",
        route: "/chat",
    },
    {
        title: "Weather Alerts",
        description: "Check weather related travel alerts",
        route: "/chat",
    },
];
export const QuickActions = () => (_jsx("div", { style: { display: "grid", gap: "10px", gridTemplateColumns: "repeat(2, 1fr)" }, children: actions.map((a) => (_jsxs("div", { style: {
            border: "1px solid #ddd",
            padding: "8px",
            borderRadius: "4px",
            cursor: "pointer",
        }, onClick: () => {
            // Navigation stub - replace with router when integrated
            console.log("Navigate to", a.route);
        }, children: [_jsx("strong", { children: a.title }), _jsx("p", { children: a.description })] }, a.title))) }));
export default QuickActions;
