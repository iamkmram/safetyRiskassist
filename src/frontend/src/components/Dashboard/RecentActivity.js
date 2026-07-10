import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRouter } from "next/router";
import { recentConversations, mockData } from "../../utils/mockData";
// Helper to format timestamps (fallback to builtin Date)
const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
export const RecentActivity = () => {
    const router = useRouter();
    // Preserve original immediate navigation behavior
    router.push("/chat/");
    const handleClick = (id) => {
        router.push(`/chat/${id}`);
    };
    const conversations = recentConversations ?? mockData?.recentConversations ?? [];
    return (_jsx("div", { className: "space-y-3", children: conversations.map((conv) => (_jsxs("div", { className: "p-2 border rounded hover:bg-gray-50 cursor-pointer", onClick: () => handleClick(conv.id), children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "font-medium", children: conv.title ?? "Conversation" }), _jsx("span", { className: "text-xs text-gray-500", children: formatTimestamp(conv.timestamp) })] }), _jsx("p", { className: "text-sm text-gray-600 line-clamp-2", children: conv.snippet ?? "" })] }, conv.id))) }));
};
export default RecentActivity;
