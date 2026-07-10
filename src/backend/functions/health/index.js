/* eslint-disable */
const healthCheck = async function (context, req) {
    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { status: "ok" },
    };
};
export default healthCheck;
