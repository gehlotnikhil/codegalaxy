"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importStar(require("ws"));
const http_1 = __importDefault(require("http"));
// Create HTTP server
const server = http_1.default.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running");
});
const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";
// Create WebSocket server
const wss = new ws_1.WebSocketServer({ server });
const waitingClients = new Map(); // Store unmatched clients
const clientPairs = new Map(); // Store matched pairs
wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("message", (message) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const data = JSON.parse(message);
            if (data.type === "register" && ((_a = data.user) === null || _a === void 0 ? void 0 : _a.id)) {
                const userId = data.user.id; // Extract the id
                const iterator = waitingClients.entries().next();
                if (!iterator.done) {
                    // Match with an existing waiting client
                    const [opponentId, opponentData] = iterator.value;
                    waitingClients.delete(opponentId);
                    const opponentWs = opponentData.socket;
                    const opponentUser = opponentData.user; // Full user object
                    clientPairs.set(ws, opponentWs);
                    clientPairs.set(opponentWs, ws);
                    const result = yield fetch(`${SERVER_URL}/api/onetoonecompete/createonetoonecompeteleaderboard`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user: [opponentUser, data.user] })
                    });
                    const jsondata = yield result.json();
                    if (jsondata.success) {
                        ws.send(JSON.stringify({ type: "matched", opponent: Object.assign(Object.assign({}, opponentUser), { leaderboardid: jsondata.result.id }) }));
                        opponentWs.send(JSON.stringify({ type: "matched", opponent: Object.assign(Object.assign({}, data.user), { leaderboardid: jsondata.result.id }) }));
                    }
                }
                else {
                    // No available client, add to waiting list
                    waitingClients.set(userId, { socket: ws, user: data.user });
                    ws.send(JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." }));
                }
            }
            if (data.type === "message" && ((_b = data.user) === null || _b === void 0 ? void 0 : _b.id) && data.message) {
                const opponentWs = clientPairs.get(ws);
                if (opponentWs && opponentWs.readyState === ws_1.default.OPEN) {
                    opponentWs.send(JSON.stringify({ type: "message", from: data.user, message: data.message }));
                }
                else {
                    ws.send(JSON.stringify({ type: "error", message: "Opponent disconnected." }));
                }
            }
        }
        catch (error) {
            console.error("Error processing message:", error);
            ws.send(JSON.stringify({ type: "error", message: "Invalid message format." }));
        }
    }));
    ws.on("close", () => {
        // Find the userId associated with the WebSocket connection
        const userEntry = [...waitingClients.entries()].find(([_, data]) => data.socket === ws);
        if (userEntry) {
            waitingClients.delete(userEntry[0]);
        }
        if (clientPairs.has(ws)) {
            const opponentWs = clientPairs.get(ws);
            if (opponentWs) {
                opponentWs.send(JSON.stringify({ type: "error", message: "Your opponent disconnected." }));
                clientPairs.delete(opponentWs);
            }
            clientPairs.delete(ws);
        }
    });
    ws.on("error", console.error);
});
// Start the server
server.listen(process.env.PORT || 8081, () => {
    console.log("WebSocket server is running");
});
