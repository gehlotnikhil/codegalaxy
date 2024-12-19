"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const CLIENT_ID = "Ov23li1Ee2cnNpYQGRb5";
const CLIENT_SECRET = "00af1acbf8e95110f3ef48f5e6ecd562f5e5de3b";
const getAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const { code } = req.query;
    if (!code) {
        return res.status(400).send({ success, error: "Missing code query parameter" });
    }
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
    });
    try {
        const response = yield fetch(`https://github.com/login/oauth/access_token`, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: params,
        });
        const data = yield response.json();
        if (data.error) {
            return res.status(400).send({ success, error: data.error_description });
        }
        console.log("f", data);
        success = true;
        res.send({ success, data });
    }
    catch (error) {
        console.error("Error fetching access token:", error);
        res.status(500).send({ success, error: "Internal server error" });
    }
});
const getUserData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let success = false;
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        return res
            .status(400)
            .send({ success, error: "Authorization header is missing" });
    }
    try {
        const response = yield fetch("https://api.github.com/user", {
            method: "GET",
            headers: {
                Authorization: authHeader,
            },
        });
        if (!response.ok) {
            const errorData = yield response.json();
            console.error("GitHub API Error:", errorData);
            return res
                .status(response.status)
                .send({ success, error: "Failed to fetch user data", details: errorData });
        }
        const data = yield response.json();
        console.log("final-", data);
        success = true;
        res.json({ success, data });
    }
    catch (error) {
        console.error("Error fetching GitHub user data:", error);
        res.status(500).send({ success, error: "Internal server error" });
    }
});
const GithubLogin = { getAccessToken, getUserData };
exports.default = GithubLogin;
