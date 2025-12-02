import dotenv from "dotenv";
dotenv.config();
import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const SERVER_URL = process.env.SERVER_URL
// const SERVER_URL = process.env.SERVER_URL||"http://localhost:8000";
const server = http.createServer();

const wss = new WebSocketServer({ noServer: true });

server.on("upgrade", (request, socket, head) => {
  if (request.url === "/ws") {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  } else {
    socket.destroy();
  }
});


const waitingClients = new Map<string, { socket: WebSocket; user: any }>(); // Store unmatched clients
const clientPairs = new Map<WebSocket, WebSocket>(); // Store matched pairs

wss.on("connection", (ws: WebSocket) => {
  console.log("New client connected");

  ws.on("message", async(message: string) => {
    try {
      const data = JSON.parse(message);

      if (data.type === "register" && data.user?.id) {
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

          const result = await fetch(`${SERVER_URL}/api/onetoonecompete/createonetoonecompeteleaderboard`,{
            method:"POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify({user:[opponentUser,data.user]})
          })
          const jsondata = await result.json();
          if(jsondata.success){
            ws.send(JSON.stringify({ type: "matched", opponent: {...opponentUser,leaderboardid:jsondata.result.id} }));
          opponentWs.send(JSON.stringify({ type: "matched", opponent: {...data.user,leaderboardid:jsondata.result.id} }));
    
}
             } else {
          // No available client, add to waiting list
          waitingClients.set(userId, { socket: ws, user: data.user });
          ws.send(JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." }));
        }
      }

      if (data.type === "message" && data.user?.id && data.message) {
        const opponentWs = clientPairs.get(ws);
        if (opponentWs && opponentWs.readyState === WebSocket.OPEN) {
          opponentWs.send(
            JSON.stringify({ type: "message", from: data.user, message: data.message })
          );
        } else {
          ws.send(JSON.stringify({ type: "error", message: "Opponent disconnected." }));
        }
      }
    } catch (error) {
      console.error("Error processing message:"+`--${SERVER_URL}/api/onetoonecompete/createonetoonecompeteleaderboard`, error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid message format." }));
    }
  });

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
// Start the server and listen on all network interfaces
server.listen(8081, '0.0.0.0', () => {
  console.log("WebSocket server is running on 0.0.0.0");
});

