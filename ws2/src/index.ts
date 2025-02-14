import WebSocket, { WebSocketServer } from "ws";
import http from "http";

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});

// Create WebSocket server
const wss = new WebSocketServer({ server });
const waitingClients = new Map<string, WebSocket>(); // Store unmatched clients
const clientPairs = new Map<WebSocket, WebSocket>(); // Store matched pairs

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("message", (message: string) => {
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
        } else {
          // No available client, add to waiting list
          waitingClients.set(userId, ws);
          ws.send(JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." }));
        }
      }

      if (data.type === "message" && data.userId && data.message) {
        const opponentWs = clientPairs.get(ws);
        if (opponentWs && opponentWs.readyState === WebSocket.OPEN) {
          opponentWs.send(JSON.stringify({ type: "message", from: data.userId, message: data.message }));
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Opponent disconnected." }));
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format." }));
    }
  });

  ws.on("close", () => {
    // Find the userId associated with the WebSocket connection
    const userId = [...waitingClients.entries()].find(([_, socket]) => socket === ws)?.[0];
  
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
