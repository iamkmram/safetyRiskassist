 
import jwt from "jsonwebtoken";
import { getSettings } from "../../../config";
const settings = getSettings();
const login = async function (context, req) {
    const { username, password } = req.body || {};
    if (!username || !password) {
        context.res = {
            status: 400,
            body: { error: "Username and password are required" },
        };
        return;
    }
    // NOTE: In a real implementation you would query the DB.
    // Here we accept any username with password "Password123!" for demo purposes.
    const isValid = password === "Password123!";
    if (!isValid) {
        context.res = {
            status: 401,
            body: { error: "Invalid credentials" },
        };
        return;
    }
    const token = jwt.sign({ sub: username, role: "user" }, settings.secret_key, { expiresIn: settings.access_token_expire_minutes * 60 });
    context.res = {
        status: 200,
        headers: { "Content-Type": "application/json" },
        body: { access_token: token, token_type: "bearer" },
    };
};
export default login;
