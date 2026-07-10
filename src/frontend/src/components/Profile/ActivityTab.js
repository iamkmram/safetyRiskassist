import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { UserActivity } from "../../../utils/mockData";
const DetailedActivityTab = () => {
    const activities = UserActivity; // mock data array
    return (_jsxs("div", { className: "space-y-2", children: [_jsx("h2", { className: "text-lg font-bold", children: "Recent Activity" }), _jsx("ul", { children: activities.map((act) => (_jsxs("li", { children: [_jsx("strong", { children: act.type }), ": ", act.description, " ", _jsxs("em", { children: ["(", new Date(act.timestamp).toLocaleString(), ")"] })] }, act.id))) })] }));
};
export const ActivityTab = () => {
    return _jsx("div", { children: "Activity Tab Placeholder" });
};
export default DetailedActivityTab;
