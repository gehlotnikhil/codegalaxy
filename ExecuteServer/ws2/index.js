const WebSocket = require("ws");
const http = require("http");
const { WebSocketServer } = WebSocket;
const { v4: uuidv4 } = require("uuid"); // Use UUID for unique client IDs
const redis = require('redis');

// -----------
// Create a Redis client
const subscriber = redis.createClient({
  password: process.env.password,
  socket: {
    host: process.env.host,
    port: process.env.port
  }
});

// Function to handle connection and subscription
async function initializeSubscriber() {
  try {
    await subscriber.connect();
    console.log('Subscriber connected to Redis server');
  } catch (err) {
    console.error('Failed to connect or subscribe:', err);
  }
}

// Handle process exit
process.on('SIGINT', async () => {
  console.log('Terminating subscriber...');
  try {
    await subscriber.unsubscribe('questions');
    console.log('Unsubscribed successfully.');
  } catch (err) {
    console.error('Error during unsubscribe:', err);
  }

  try {
    await subscriber.quit();
    console.log('Subscriber disconnected from Redis.');
  } catch (err) {
    console.error('Error during quit:', err);
  }
  process.exit();
});

// --------------

// Create HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("WebSocket server is running");
});

// Create WebSocket server
const wss = new WebSocketServer({ server });
const clients = new Map(); // Map to store clientId and WebSocket connection

wss.on("connection", (ws) => {
  // Assign a unique clientId 
  const clientId = uuidv4();
  clients.set(clientId, ws); // Map clientId to WebSocket instance
  console.log(`New client connected: ${clientId}`);

  // Send clientId to the newly connected client
  ws.send(JSON.stringify({ type: "welcome", clientId }));

  // Handle messages from clients
  ws.on("message", async (message) => {
    console.log(`Message received: ${message}`);

    try {
      const parsedMessage = JSON.parse(message);
      const { clientId, content } = parsedMessage;

      if (!clients.has(clientId)) {
        ws.send(JSON.stringify({ type: "error", message: "Invalid clientId" }));
        return;
      }

      console.log(`Message from ${clientId}: ${content}`);

      // Subscribe to the "question" channel for a single response
      await subscriber.subscribe('question', async (msg, channel) => {
        console.log(`Received message from ${channel}: ${msg}`);

        const receivedMessage = JSON.parse(msg);

        if (clientId === receivedMessage.clientId) {
          ws.send(
            JSON.stringify({
              type: "question",
              message: `${msg}`,
            })
          );

          // Unsubscribe the client after sending the response
          await subscriber.unsubscribe('question');

          // Close the WebSocket connection
          ws.close();
          console.log(`Closed connection for client: ${clientId}`);
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format", error })
      );
    }
  });

  // Handle client disconnect
  ws.on("close", () => {
    console.log(`Client disconnected: ${clientId}`);
    clients.delete(clientId); // Remove client from the map
  });

  ws.on("error", console.error);
});

// Start the server
server.listen(8080, () => {
  console.log("WebSocket server is running on ws://localhost:8080");
});
initializeSubscriber();
