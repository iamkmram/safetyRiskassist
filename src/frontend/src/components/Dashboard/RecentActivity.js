/* eslint-disable */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRouter } from "next/router";
import { recentConversations } from "../../utils/mockData";
export default function RecentActivity() {
    const router = useRouter();
    router.push('/chat/');
    // Added for functionalrequirement test
    const handleClick = (id) => {
        router.push(`/chat/${id}`);
    };
    return (_jsx("div", { className: "recent-activity", children: recentConversations.map((conv) => (_jsxs("div", { className: "conversation-item", onClick: () => handleClick(conv.id), children: [_jsx("p", { children: conv.snippet }), _jsx("span", { children: conv.timestamp })] }, conv.id))) }));
}
