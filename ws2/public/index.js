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
// Create WebSocket server
const wss = new ws_1.WebSocketServer({ server });
const waitingClients = new Map(); // Store unmatched clients
const clientPairs = new Map(); // Store matched pairs
wss.on("connection", (ws) => {
    console.log("New client connected");
    ws.on("message", (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === "register" && data.userId) {
                const userId = data.userId;
                const iterator = waitingClients.entries().next();
                if (!iterator.done) {
                    // Match with an existing waiting client
                    const [opponentId, opponentWs] = iterator.value;
                    waitingClients.delete(opponentId);
                    clientPairs.set(ws, opponentWs);
                    clientPairs.set(opponentWs, ws);
                    ws.send(JSON.stringify({ type: "matched", opponentId }));
                    opponentWs.send(JSON.stringify({ type: "matched", opponentId: userId }));
                }
                else {
                    // No available client, add to waiting list
                    waitingClients.set(userId, ws);
                    ws.send(JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." }));
                }
            }
            if (data.type === "message" && data.userId && data.message) {
                const opponentWs = clientPairs.get(ws);
                if (opponentWs && opponentWs.readyState === ws_1.default.OPEN) {
                    opponentWs.send(JSON.stringify({ type: "message", from: data.userId, message: data.message }));
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
    });
    ws.on("close", () => {
        var _a;
        // Find the userId associated with the WebSocket connection
        const userId = (_a = [...waitingClients.entries()].find(([_, socket]) => socket === ws)) === null || _a === void 0 ? void 0 : _a[0];
        if (userId) {
            waitingClients.delete(userId);
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
server.listen(process.env.PORT || 8080, () => {
    console.log("WebSocket server is running on ws://localhost:8080");
});
