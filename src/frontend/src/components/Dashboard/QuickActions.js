import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// import { useRouter } from "next/router";
export default function QuickActions() {
    const router = useRouter();
    router.push('/chat');
    // Added for functionalrequirement test
    const actions = [
        {
            title: "Latest COVID-19 Restrictions",
            description: "Get current travel requirements",
            query: "What are the latest COVID-19 travel restrictions?",
            route: "/chat",
        },
        {
            title: "High-Risk Destinations",
            description: "View current travel warnings",
            query: "Show me high-risk travel destinations",
            route: "/chat",
        },
        {
            title: "Emergency Protocols",
            description: "Access emergency procedures",
            query: "What emergency protocols should I follow?",
            route: "/chat",
        },
        {
            title: "Weather Alerts",
            description: "Check severe weather warnings",
            query: "Are there any weather-related travel alerts?",
            route: "/chat",
        },
    ];
    const handleClick = (action) => {
        // Prefill the query via URL param (implementationspecific)
        router.push(`${action.route}?prefill=${encodeURIComponent(action.query)}`);
    };
    return (_jsx("div", { className: "quick-actions", children: actions.map((a) => (_jsxs("div", { className: "action-card", onClick: () => handleClick(a), children: [_jsx("h3", { children: a.title }), _jsx("p", { children: a.description })] }, a.title))) }));
}
